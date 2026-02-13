import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/browser";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  ICreateOrderPayload,
  ICreateOrderReviewPayload,
  IOrderItemInput,
} from "./order.interface";

const ensureQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order item quantity must be a positive integer",
    );
  }
};

const toNumber = (value: unknown, field: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid numeric value for ${field}`,
    );
  }
  return parsed;
};

interface IBuildOrderResult {
  orderItems: Prisma.OrderItemCreateWithoutOrderInput[];
  totalAmount: number;
  currency: string;
  mealsToDecrement: Map<string, number>;
  cartId?: string;
}

const buildOrderFromCart = async (
  userId: string,
  providerProfileId: string,
): Promise<IBuildOrderResult> => {
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
          options: {
            include: {
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

    const selectedOptions =
      item.options && item.options.length > 0
        ? item.options
        : item.variantOption
          ? [
              {
                variantOption: item.variantOption,
                priceDelta: item.variantOption.priceDelta,
              },
            ]
          : [];

    selectedOptions.forEach((cartOption) => {
      const option = cartOption.variantOption;
      if (!option || option.variant.mealId !== meal.id) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Variant option does not belong to the meal",
        );
      }

      const delta = toNumber(
        cartOption.priceDelta,
        "variant option priceDelta",
      );
      priceDelta += delta;
      optionCreates.push({
        variantOption: { connect: { id: option.id } },
        priceDelta: delta,
      });
    });

    const unitPrice = toNumber(meal.price, "meal price") + priceDelta;
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

const buildOrderFromItems = async (
  providerProfileId: string,
  items: IOrderItemInput[],
): Promise<IBuildOrderResult> => {
  if (!items.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order items are required");
  }

  const mealIds = Array.from(
    new Set(items.map((item) => item.mealId).filter(Boolean)),
  );
  if (!mealIds.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal IDs are required");
  }

  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealIds },
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      price: true,
      stock: true,
      currency: true,
      providerProfileId: true,
    },
  });

  const mealById = new Map(meals.map((meal) => [meal.id, meal] as const));

  if (mealById.size !== mealIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more meals are unavailable",
    );
  }

  const optionIds = Array.from(
    new Set(
      items.flatMap((item) => item.variantOptionIds ?? []).filter(Boolean),
    ),
  );

  const variantOptionById = new Map<
    string,
    {
      id: string;
      priceDelta: unknown;
      variant: { id: string; mealId: string };
    }
  >();

  if (optionIds.length) {
    const options = await prisma.mealVariantOption.findMany({
      where: {
        id: { in: optionIds },
      },
      select: {
        id: true,
        priceDelta: true,
        variant: {
          select: {
            id: true,
            mealId: true,
          },
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
      variantOptionById.set(option.id, option);
    });
  }

  const quantityByMeal = new Map<string, number>();
  const mealsToDecrement = new Map<string, number>();
  const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  let totalAmount = 0;
  let currency: string | null = null;

  items.forEach((item) => {
    if (!item.mealId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
    }

    ensureQuantity(item.quantity);

    const meal = mealById.get(item.mealId);
    if (!meal) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more meals are unavailable",
      );
    }

    if (meal.providerProfileId !== providerProfileId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Order contains items from another provider",
      );
    }

    if (currency && currency !== meal.currency) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "All meals in an order must use the same currency",
      );
    }
    currency = meal.currency;

    const uniqueOptionIds = Array.from(new Set(item.variantOptionIds ?? []));
    const variantIdsInItem = new Set<string>();

    let priceDelta = 0;
    const optionCreates: Prisma.OrderItemOptionCreateWithoutOrderItemInput[] =
      [];

    uniqueOptionIds.forEach((optionId) => {
      const option = variantOptionById.get(optionId);
      if (!option || option.variant.mealId !== meal.id) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Variant option does not belong to the meal",
        );
      }

      // Protect data integrity: only one option per variant group.
      if (variantIdsInItem.has(option.variant.id)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Only one option can be selected from each variant",
        );
      }
      variantIdsInItem.add(option.variant.id);

      const delta = toNumber(option.priceDelta, "variant option priceDelta");
      priceDelta += delta;
      optionCreates.push({
        variantOption: { connect: { id: option.id } },
        priceDelta: delta,
      });
    });

    const unitPrice = toNumber(meal.price, "meal price") + priceDelta;
    const subtotal = unitPrice * item.quantity;
    totalAmount += subtotal;

    quantityByMeal.set(meal.id, (quantityByMeal.get(meal.id) ?? 0) + item.quantity);

    orderItems.push({
      meal: { connect: { id: meal.id } },
      quantity: item.quantity,
      unitPrice,
      subtotal,
      notes: item.notes,
      ...(optionCreates.length > 0 && { options: { create: optionCreates } }),
    });
  });

  quantityByMeal.forEach((qty, mealId) => {
    const meal = mealById.get(mealId);
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

  const hasManualItems = Boolean(payload.items?.length);

  const { orderItems, totalAmount, currency, mealsToDecrement, cartId } =
    hasManualItems
      ? await buildOrderFromItems(payload.providerProfileId, payload.items ?? [])
      : await buildOrderFromCart(userId, payload.providerProfileId);

  const createdOrderId = await prisma.$transaction(
    async (tx) => {
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
        select: { id: true },
      });

      if (cartId) {
        await tx.cartItem.deleteMany({
          where: { cartId },
        });
      }

      return createdOrder.id;
    },
    {
      maxWait: 10_000,
      timeout: 20_000,
    },
  );

  const order = await prisma.order.findUnique({
    where: { id: createdOrderId },
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
              variantOption: {
                include: {
                  variant: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
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

  if (!order) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Order created but failed to load details",
    );
  }

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
                variantOption: {
                  include: {
                    variant: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
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
              variantOption: {
                include: {
                  variant: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
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

const createOrderReview = async (
  userId: string,
  orderId: string,
  payload: ICreateOrderReviewPayload,
) => {
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const mealId = payload?.mealId?.trim();
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const rating = Number(payload?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be an integer between 1 and 5",
    );
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      status: true,
      items: {
        select: {
          mealId: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.status !== "delivered") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only delivered orders",
    );
  }

  const allowedMealIds = new Set(order.items.map((item) => item.mealId));
  if (!allowedMealIds.has(mealId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The selected meal does not belong to this order",
    );
  }

  const review = await prisma.review.upsert({
    where: {
      userId_mealId: {
        userId,
        mealId,
      },
    },
    update: {
      orderId: order.id,
      rating,
      comment: payload?.comment?.trim() || null,
    },
    create: {
      userId,
      mealId,
      orderId: order.id,
      rating,
      comment: payload?.comment?.trim() || null,
    },
    include: {
      meal: {
        select: {
          id: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return review;
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

  const updatedOrder = await prisma.$transaction(
    async (tx) => {
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
    },
    {
      maxWait: 10_000,
      timeout: 20_000,
    },
  );

  return updatedOrder;
};

export const OrderServices = {
  createOrder,
  getMyOrders,
  getOrderById,
  createOrderReview,
  cancelOrder,
};
