import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  IAddCartItemPayload,
  IUpdateCartItemPayload,
} from "./cart.interface";

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

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

const cartItemInclude = {
  meal: {
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      providerProfileId: true,
    },
  },
  variantOption: {
    include: {
      variant: {
        select: {
          id: true,
          name: true,
          mealId: true,
        },
      },
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
              mealId: true,
            },
          },
        },
      },
    },
  },
} as const;

type CartItemWithRelations = {
  id: string;
  mealId: string;
  variantOptionId: string | null;
  optionKey: string;
  quantity: number;
  meal: {
    id: string;
    title: string;
    price: unknown;
    currency: string;
    providerProfileId: string;
  };
  variantOption?: {
    id: string;
    title: string;
    priceDelta: unknown;
    variant?: {
      id: string;
      name: string;
      mealId: string;
    } | null;
  } | null;
  options: Array<{
    id: string;
    priceDelta: unknown;
    variantOption: {
      id: string;
      title: string;
      variant?: {
        id: string;
        name: string;
        mealId: string;
      } | null;
    };
  }>;
};

const mapCartItemWithPricing = (item: CartItemWithRelations) => {
  const basePrice = toNumber(item.meal.price, 0);

  const selectedVariants =
    item.options && item.options.length > 0
      ? item.options.map((entry) => ({
          variantId: entry.variantOption.variant?.id ?? null,
          variantName: entry.variantOption.variant?.name ?? null,
          optionId: entry.variantOption.id,
          optionTitle: entry.variantOption.title,
          priceDelta: toNumber(entry.priceDelta, 0),
        }))
      : item.variantOption
        ? [
            {
              variantId: item.variantOption.variant?.id ?? null,
              variantName: item.variantOption.variant?.name ?? null,
              optionId: item.variantOption.id,
              optionTitle: item.variantOption.title,
              priceDelta: toNumber(item.variantOption.priceDelta, 0),
            },
          ]
        : [];

  const variantPriceTotal = selectedVariants.reduce(
    (sum, option) => sum + option.priceDelta,
    0,
  );
  const unitPrice = basePrice + variantPriceTotal;
  const lineTotal = unitPrice * item.quantity;

  return {
    ...item,
    selectedVariants,
    pricing: {
      currency: item.meal.currency,
      basePrice,
      variantPriceTotal,
      unitPrice,
      lineTotal,
    },
  };
};

const normalizeOptionIds = (payload: IAddCartItemPayload) => {
  const rawIds = [
    ...(payload.variantOptionIds ?? []),
    ...(payload.variantOptionId ? [payload.variantOptionId] : []),
  ];

  const uniqueIds = Array.from(new Set(rawIds.filter(Boolean)));
  return uniqueIds.sort((a, b) => a.localeCompare(b));
};

const buildOptionKey = (optionIds: string[]) => optionIds.join("|");

const validateMealAndOptions = async (mealId: string, optionIds: string[]) => {
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      deletedAt: null,
      isActive: true,
      providerProfile: {
        isVerified: true,
      },
    },
    select: { id: true, providerProfileId: true },
  });

  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  if (!optionIds.length) {
    return {
      meal,
      options: [] as Array<{
        id: string;
        title: string;
        priceDelta: number;
        variant: { id: string; name: string; mealId: string };
      }>,
    };
  }

  const options = await prisma.mealVariantOption.findMany({
    where: { id: { in: optionIds } },
    include: {
      variant: {
        select: {
          id: true,
          name: true,
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

  const variantIds = new Set<string>();

  const normalizedOptions = options.map((option) => {
    if (option.variant.mealId !== mealId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Variant option does not belong to the meal",
      );
    }

    if (variantIds.has(option.variant.id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only one option can be selected from each variant",
      );
    }
    variantIds.add(option.variant.id);

    return {
      id: option.id,
      title: option.title,
      priceDelta: toNumber(option.priceDelta, 0),
      variant: {
        id: option.variant.id,
        name: option.variant.name,
        mealId: option.variant.mealId,
      },
    };
  });

  normalizedOptions.sort((a, b) => a.id.localeCompare(b.id));

  return {
    meal,
    options: normalizedOptions,
  };
};

const buildCartResponse = (
  userId: string,
  cart:
    | {
        id: string;
        userId: string;
        items: CartItemWithRelations[];
      }
    | null,
) => {
  if (!cart) {
    return {
      id: null,
      userId,
      items: [],
      summary: {
        currency: null,
        baseTotal: 0,
        variantTotal: 0,
        subtotal: 0,
        itemsCount: 0,
      },
    };
  }

  const items = cart.items.map(mapCartItemWithPricing);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const baseTotal = items.reduce(
    (sum, item) => sum + item.pricing.basePrice * item.quantity,
    0,
  );
  const variantTotal = items.reduce(
    (sum, item) => sum + item.pricing.variantPriceTotal * item.quantity,
    0,
  );
  const subtotal = items.reduce((sum, item) => sum + item.pricing.lineTotal, 0);

  const uniqueCurrencies = new Set(items.map((item) => item.pricing.currency));
  const summaryCurrency =
    uniqueCurrencies.size === 1 ? [...uniqueCurrencies][0] : null;

  return {
    ...cart,
    items,
    summary: {
      currency: summaryCurrency,
      baseTotal,
      variantTotal,
      subtotal,
      itemsCount,
    },
  };
};

const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: cartItemInclude,
      },
    },
  });

  return buildCartResponse(userId, cart as { id: string; userId: string; items: CartItemWithRelations[] } | null);
};

const addItem = async (userId: string, payload: IAddCartItemPayload) => {
  if (!payload?.mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const quantity = payload.quantity ?? 1;
  ensureQuantity(quantity);

  const optionIds = normalizeOptionIds(payload);
  const optionKey = buildOptionKey(optionIds);
  const validated = await validateMealAndOptions(payload.mealId, optionIds);
  const primaryOptionId = validated.options[0]?.id ?? null;

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      mealId: payload.mealId,
      optionKey,
    },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: { increment: quantity },
      },
      include: cartItemInclude,
    });

    return mapCartItemWithPricing(updated as CartItemWithRelations);
  }

  const created = await prisma.cartItem.create({
    data: {
      cart: { connect: { id: cart.id } },
      meal: { connect: { id: payload.mealId } },
      optionKey,
      ...(primaryOptionId
        ? { variantOption: { connect: { id: primaryOptionId } } }
        : {}),
      ...(validated.options.length > 0
        ? {
            options: {
              create: validated.options.map((option) => ({
                variantOption: { connect: { id: option.id } },
                priceDelta: option.priceDelta,
              })),
            },
          }
        : {}),
      quantity,
    },
    include: cartItemInclude,
  });

  return mapCartItemWithPricing(created as CartItemWithRelations);
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

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: payload.quantity },
    include: {
      ...cartItemInclude,
    },
  });

  return mapCartItemWithPricing(updated as CartItemWithRelations);
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
