import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/browser";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { ICreateOrderPayload } from "./order.interface";

const ensureQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order item quantity must be a positive integer",
    );
  }
};

const buildOrderFromCart = async (
  userId: string,
  providerProfileId: string,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              price: true,
              stock: true,
              currency: true,
              providerProfileId: true,
              deletedAt: true,
              isActive: true,
            },
          },
          variantOption: {
            include: {
              variant: {
                select: { mealId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  const quantityByMeal = new Map<string, number>();
  const mealsToDecrement = new Map<string, number>();
  const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  let totalAmount = 0;
  let currency: string | null = null;

  cart.items.forEach((item) => {
    ensureQuantity(item.quantity);

    const meal = item.meal;
    if (!meal || meal.deletedAt || !meal.isActive) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more meals in cart are unavailable",
      );
    }

    if (meal.providerProfileId !== providerProfileId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cart contains items from another provider",
      );
    }

    if (currency && currency !== meal.currency) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "All meals in an order must use the same currency",
      );
    }
    currency = meal.currency;

    let priceDelta = 0;
    const optionCreates: Prisma.OrderItemOptionCreateWithoutOrderItemInput[] =
      [];

    if (item.variantOptionId) {
      const option = item.variantOption;
      if (!option || option.variant.mealId !== meal.id) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Variant option does not belong to the meal",
        );
      }

      priceDelta = Number(option.priceDelta);
      optionCreates.push({
        variantOption: { connect: { id: option.id } },
        priceDelta,
      });
    }

    const unitPrice = Number(meal.price) + priceDelta;
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
      ...(optionCreates.length > 0 && { options: { create: optionCreates } }),
    });
  });

  quantityByMeal.forEach((qty, mealId) => {
    const meal = cart.items.find((item) => item.meal.id === mealId)?.meal;
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
    cartId: cart.id,
  };
};

const createOrder = async (userId: string, payload: ICreateOrderPayload) => {
  if (!payload.providerProfileId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
  }
  if (!payload.deliveryAddressId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Delivery address is required");
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

  const { orderItems, totalAmount, currency, mealsToDecrement, cartId } =
    await buildOrderFromCart(userId, payload.providerProfileId);

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

    await tx.cartItem.deleteMany({
      where: { cartId },
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
