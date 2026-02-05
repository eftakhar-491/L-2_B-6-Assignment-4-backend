import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  IAddCartItemPayload,
  IUpdateCartItemPayload,
} from "./cart.interface";

const ensureQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Quantity must be a positive integer",
    );
  }
};

const getOrCreateCart = async (userId: string) => {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
};

const validateMealAndOption = async (
  mealId: string,
  variantOptionId?: string | null,
) => {
  const meal = await prisma.meal.findFirst({
    where: { id: mealId, deletedAt: null, isActive: true },
    select: { id: true },
  });

  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  if (variantOptionId) {
    const option = await prisma.mealVariantOption.findUnique({
      where: { id: variantOptionId },
      include: { variant: { select: { mealId: true } } },
    });

    if (!option || option.variant.mealId !== mealId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Variant option does not belong to the meal",
      );
    }
  }
};

const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: true,
          variantOption: {
            include: {
              variant: true,
            },
          },
        },
      },
    },
  });

  return (
    cart ?? {
      id: null,
      userId,
      items: [],
    }
  );
};

const addItem = async (userId: string, payload: IAddCartItemPayload) => {
  if (!payload?.mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const quantity = payload.quantity ?? 1;
  ensureQuantity(quantity);

  const optionId = payload.variantOptionId ?? null;
  await validateMealAndOption(payload.mealId, optionId);

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      mealId: payload.mealId,
      variantOptionId: optionId,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: { increment: quantity },
      },
      include: {
        meal: true,
        variantOption: {
          include: {
            variant: true,
          },
        },
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cart: { connect: { id: cart.id } },
      meal: { connect: { id: payload.mealId } },
      variantOptionId: optionId,
      quantity,
    },
    include: {
      meal: true,
      variantOption: {
        include: {
          variant: true,
        },
      },
    },
  });
};

const updateItem = async (
  userId: string,
  itemId: string,
  payload: IUpdateCartItemPayload,
) => {
  if (!itemId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart item ID is required");
  }

  ensureQuantity(payload.quantity);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: payload.quantity },
    include: {
      meal: true,
      variantOption: {
        include: {
          variant: true,
        },
      },
    },
  });
};

const removeItem = async (userId: string, itemId: string) => {
  if (!itemId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart item ID is required");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
  });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  return { id: itemId };
};

const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) {
    return { cleared: true };
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return { cleared: true };
};

export const CartServices = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
