import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/browser";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { ICreateOrderPayload, IOrderItemInput } from "./order.interface";

const ensureQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order item quantity must be a positive integer",
    );
  }
};

const buildOrderItems = async (
  items: IOrderItemInput[],
  providerProfileId: string,
) => {
  const mealIds = items.map((item) => item.mealId);
  const uniqueMealIds = Array.from(new Set(mealIds));
  const meals = await prisma.meal.findMany({
    where: {
      id: { in: uniqueMealIds },
      providerProfileId,
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      price: true,
      stock: true,
      currency: true,
    },
  });

  if (meals.length !== uniqueMealIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more meals are invalid for this provider",
    );
  }

  const mealMap = new Map(
    meals.map((meal) => [meal.id, meal] as const),
  );

  const optionIds = Array.from(
    new Set(
      items.flatMap((item) => item.variantOptionIds ?? []),
    ),
  );

  const optionMap = new Map<
    string,
    { mealId: string; priceDelta: number }
  >();

  if (optionIds.length) {
    const options = await prisma.mealVariantOption.findMany({
      where: { id: { in: optionIds } },
      include: {
        variant: {
          select: { mealId: true },
        },
      },
    });

    if (options.length !== optionIds.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more variant options are invalid",
      );
    }

    options.forEach((option) => {
      optionMap.set(option.id, {
        mealId: option.variant.mealId,
        priceDelta: Number(option.priceDelta),
      });
    });
  }

  const quantityByMeal = new Map<string, number>();
  const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  let totalAmount = 0;
  let currency: string | null = null;

  items.forEach((item) => {
    ensureQuantity(item.quantity);

    const meal = mealMap.get(item.mealId);
    if (!meal) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more meals are invalid",
      );
    }

    if (currency && currency !== meal.currency) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "All meals in an order must use the same currency",
      );
    }
    currency = meal.currency;

    const optionIdsForItem = Array.from(
      new Set(item.variantOptionIds ?? []),
    );
    let priceDeltaSum = 0;
    const optionCreates: Prisma.OrderItemOptionCreateWithoutOrderItemInput[] =
      [];

    optionIdsForItem.forEach((optionId) => {
      const option = optionMap.get(optionId);
      if (!option || option.mealId !== meal.id) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Variant option does not belong to the meal",
        );
      }

      priceDeltaSum += option.priceDelta;
      optionCreates.push({
        variantOption: { connect: { id: optionId } },
        priceDelta: option.priceDelta,
      });
    });

    const unitPrice = Number(meal.price) + priceDeltaSum;
    const subtotal = unitPrice * item.quantity;
    totalAmount += subtotal;

    quantityByMeal.set(
      meal.id,
      (quantityByMeal.get(meal.id) ?? 0) + item.quantity,
    );

    orderItems.push({
      meal: { connect: { id: meal.id } },
      quantity: item.quantity,
      unitPrice,
      subtotal,
      notes: item.notes,
      ...(optionCreates.length > 0 && { options: { create: optionCreates } }),
    });
  });

  const mealsToDecrement = new Map<string, number>();

  quantityByMeal.forEach((qty, mealId) => {
    const meal = mealMap.get(mealId);
    if (meal?.stock !== null && meal?.stock !== undefined) {
      if (meal.stock < qty) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Not enough stock for one or more meals",
        );
      }
      mealsToDecrement.set(mealId, qty);
    }
  });

  return {
    orderItems,
    totalAmount,
    currency: currency ?? "USD",
    mealsToDecrement,
  };
};

const createOrder = async (userId: string, payload: ICreateOrderPayload) => {
  if (!payload.providerProfileId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
  }
  if (!payload.deliveryAddressId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Delivery address is required");
  }
  if (!payload.items?.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order items are required");
  }
  if (payload.paymentMethod && payload.paymentMethod !== "cash_on_delivery") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only cash on delivery is allowed");
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { id: payload.providerProfileId },
    select: { id: true },
  });

  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Provider not found");
  }

  const address = await prisma.address.findFirst({
    where: {
      id: payload.deliveryAddressId,
      userId,
    },
    select: { id: true },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Delivery address not found");
  }

  const { orderItems, totalAmount, currency, mealsToDecrement } =
    await buildOrderItems(payload.items, payload.providerProfileId);

  const order = await prisma.$transaction(async (tx) => {
    for (const [mealId, qty] of mealsToDecrement.entries()) {
      await tx.meal.update({
        where: { id: mealId },
        data: {
          ...(qty > 0 && { stock: { decrement: qty } }),
        },
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        user: { connect: { id: userId } },
        providerProfile: { connect: { id: payload.providerProfileId } },
        address: { connect: { id: payload.deliveryAddressId } },
        totalAmount,
        currency,
        paymentMethod: "cash_on_delivery",
        notes: payload.notes,
        items: { create: orderItems },
      },
      include: {
        items: {
          include: {
            meal: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
            options: {
              include: {
                variantOption: true,
              },
            },
          },
        },
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true,
          },
        },
        address: true,
      },
    });

    return createdOrder;
  });

  return order;
};

const getMyOrders = async (userId: string, query: Record<string, string>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { placedAt: "desc" },
      include: {
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
            options: {
              include: {
                variantOption: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getOrderById = async (userId: string, orderId: string) => {
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      providerProfile: {
        select: {
          id: true,
          name: true,
          logoSrc: true,
        },
      },
      address: true,
      items: {
        include: {
          meal: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
          options: {
            include: {
              variantOption: true,
            },
          },
        },
      },
      reviews: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const cancelOrder = async (userId: string, orderId: string) => {
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.status !== "placed") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only placed orders can be cancelled",
    );
  }

  const orderItemMealIds = Array.from(
    new Set(order.items.map((item) => item.mealId)),
  );

  const meals = await prisma.meal.findMany({
    where: { id: { in: orderItemMealIds } },
    select: { id: true, stock: true },
  });

  const stockByMealId = new Map(
    meals.map((meal) => [meal.id, meal.stock] as const),
  );

  const quantityByMeal = new Map<string, number>();
  order.items.forEach((item) => {
    quantityByMeal.set(
      item.mealId,
      (quantityByMeal.get(item.mealId) ?? 0) + item.quantity,
    );
  });

  const updatedOrder = await prisma.$transaction(async (tx) => {
    for (const [mealId, qty] of quantityByMeal.entries()) {
      const stock = stockByMealId.get(mealId);
      if (stock !== null && stock !== undefined) {
        await tx.meal.update({
          where: { id: mealId },
          data: { stock: { increment: qty } },
        });
      }
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });
  });

  return updatedOrder;
};

export const OrderServices = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
