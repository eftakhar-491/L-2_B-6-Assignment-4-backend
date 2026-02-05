import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/browser";
import type {
  ICategoryInput,
  ICreateMealPayload,
  ICreateProviderProfilePayload,
  IDietaryPreferenceInput,
  IMealImageInput,
  IMealVariantInput,
  IUpdateMealPayload,
  IUpdateOrderStatusPayload,
  IUpdateProviderProfilePayload,
  OrderStatus,
  ProviderOrderStatus,
} from "./provider.interface";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getProviderProfileOrThrow = async (userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Provider profile not found. Please create a profile first.",
    );
  }

  return providerProfile;
};

const ensureProviderRole = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role !== "provider") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only providers can access this resource",
    );
  }

  return user;
};

const createProviderProfile = async (
  userId: string,
  payload: ICreateProviderProfilePayload,
) => {
  await ensureProviderRole(userId);

  if (!payload?.name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Provider name is required");
  }

  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Provider profile already exists",
    );
  }

  const profile = await prisma.providerProfile.create({
    data: {
      user: { connect: { id: userId } },
      name: payload.name.trim(),
      description: payload.description,
      address: payload.address,
      phone: payload.phone,
      website: payload.website,
      logoSrc: payload.logoSrc,
    },
  });

  return profile;
};

const updateProviderProfile = async (
  userId: string,
  payload: IUpdateProviderProfilePayload,
) => {
  await ensureProviderRole(userId);

  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Provider profile not found. Please create a profile first.",
    );
  }

  const profile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      ...(payload.address !== undefined && { address: payload.address }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.website !== undefined && { website: payload.website }),
      ...(payload.logoSrc !== undefined && { logoSrc: payload.logoSrc }),
    },
  });

  return profile;
};

const ensureValidPrice = (price: unknown) => {
  const value = Number(price);
  if (!Number.isFinite(value) || value <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Price must be a valid positive number",
    );
  }
};

const ensureValidStock = (stock: unknown) => {
  if (stock === undefined || stock === null) return;
  const value = Number(stock);
  if (!Number.isInteger(value) || value < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Stock must be a non-negative integer",
    );
  }
};

const parseBoolean = (value?: string) => {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const parseSort = (
  sort: string | undefined,
): Prisma.ProviderProfileOrderByWithRelationInput[] => {
  const sortBy = sort || "createdAt";
  return sortBy.split(",").map((field) => {
    if (field.startsWith("-")) {
      return { [field.substring(1)]: "desc" };
    }
    return { [field]: "asc" };
  });
};

const parsePagination = (page?: string, limit?: string) => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  };
};

const ensureValidPriceDelta = (priceDelta: unknown) => {
  if (priceDelta === undefined || priceDelta === null) return;
  const value = Number(priceDelta);
  if (!Number.isFinite(value)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Variant option price delta must be a valid number",
    );
  }
};

const normalizeImages = (images?: IMealImageInput[]) => {
  if (!images?.length) return undefined;

  const primaryCount = images.filter((img) => img.isPrimary).length;
  if (primaryCount > 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only one meal image can be primary",
    );
  }

  return images.map((img, index) => {
    if (!img?.src?.trim()) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal image src is required");
    }
    return {
      src: img.src,
      publicId: img.publicId,
      altText: img.altText,
      isPrimary: img.isPrimary ?? (primaryCount === 0 && index === 0),
    };
  });
};

const normalizeVariants = (variants?: IMealVariantInput[]) => {
  if (!variants?.length) return undefined;

  return variants.map((variant) => {
    if (!variant?.name?.trim()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Meal variant name is required",
      );
    }

    const options = variant.options ?? [];
    const defaultCount = options.filter((opt) => opt.isDefault).length;
    if (defaultCount > 1) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only one default option is allowed per variant",
      );
    }

    const optionCreates = options.map((option) => {
      if (!option?.title?.trim()) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Meal variant option title is required",
        );
      }
      ensureValidPriceDelta(option.priceDelta);

      return {
        title: option.title,
        priceDelta: option.priceDelta ?? 0,
        isDefault: option.isDefault ?? false,
      };
    });

    const createInput: Prisma.MealVariantCreateWithoutMealInput = {
      name: variant.name,
      isRequired: variant.isRequired ?? false,
      ...(optionCreates.length > 0 && { options: { create: optionCreates } }),
    };

    return createInput;
  });
};

const normalizeCategories = (
  categories?: ICategoryInput[],
  categoryIds?: string[],
) => {
  const idSet = new Set<string>();
  const slugMap = new Map<
    string,
    { name: string; slug: string; description?: string }
  >();

  (categoryIds ?? []).forEach((id) => {
    if (id) idSet.add(id);
  });

  (categories ?? []).forEach((category) => {
    if (category?.id) {
      idSet.add(category.id);
      return;
    }

    const rawSlug = category?.slug ?? category?.name;
    if (!rawSlug) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Category name or slug is required",
      );
    }

    const slug = slugify(rawSlug);
    if (!slug) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category slug is invalid");
    }

    const name = category?.name?.trim() || category?.slug?.trim() || slug;
    slugMap.set(slug, {
      name,
      slug,
      description: category?.description,
    });
  });

  const mealCategoryCreates: Prisma.MealCategoryCreateWithoutMealInput[] = [];

  idSet.forEach((id) => {
    mealCategoryCreates.push({
      category: { connect: { id } },
    });
  });

  slugMap.forEach((category) => {
    mealCategoryCreates.push({
      category: {
        connectOrCreate: {
          where: { slug: category.slug },
          create: category,
        },
      },
    });
  });

  return {
    mealCategoryCreates,
    categoryIdsToLink: Array.from(idSet),
    categorySlugsToLink: Array.from(slugMap.keys()),
  };
};

const normalizeDietaryPreferences = (
  preferences?: IDietaryPreferenceInput[],
  preferenceIds?: string[],
) => {
  const idSet = new Set<string>();
  const slugMap = new Map<string, { name: string; slug: string }>();

  (preferenceIds ?? []).forEach((id) => {
    if (id) idSet.add(id);
  });

  (preferences ?? []).forEach((pref) => {
    if (pref?.id) {
      idSet.add(pref.id);
      return;
    }

    const rawSlug = pref?.slug ?? pref?.name;
    if (!rawSlug) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Dietary preference name or slug is required",
      );
    }

    const slug = slugify(rawSlug);
    if (!slug) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Dietary preference slug is invalid",
      );
    }

    const name = pref?.name?.trim() || pref?.slug?.trim() || slug;
    slugMap.set(slug, { name, slug });
  });

  const dietaryTagCreates: Prisma.MealDietaryPreferenceCreateWithoutMealInput[] =
    [];

  idSet.forEach((id) => {
    dietaryTagCreates.push({
      dietaryPreference: { connect: { id } },
    });
  });

  slugMap.forEach((pref) => {
    dietaryTagCreates.push({
      dietaryPreference: {
        connectOrCreate: {
          where: { slug: pref.slug },
          create: pref,
        },
      },
    });
  });

  return {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink: Array.from(idSet),
    dietaryPreferenceSlugsToLink: Array.from(slugMap.keys()),
  };
};

const ensureCategoryIdsExist = async (categoryIds: string[]) => {
  if (!categoryIds.length) return;
  const existing = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true },
  });

  if (existing.length !== categoryIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more category IDs are invalid",
    );
  }
};

const ensureDietaryPreferenceIdsExist = async (preferenceIds: string[]) => {
  if (!preferenceIds.length) return;
  const existing = await prisma.dietaryPreference.findMany({
    where: { id: { in: preferenceIds } },
    select: { id: true },
  });

  if (existing.length !== preferenceIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more dietary preference IDs are invalid",
    );
  }
};

const addMeal = async (userId: string, payload: ICreateMealPayload) => {
  if (!payload?.title?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal title is required");
  }
  if (payload.price === undefined || payload.price === null) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal price is required");
  }
  ensureValidPrice(payload.price);
  ensureValidStock(payload.stock);

  const providerProfile = await getProviderProfileOrThrow(userId);

  const rawSlug = payload.slug ?? payload.title;
  const slug = slugify(rawSlug);
  if (!slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal slug is invalid");
  }

  const existingSlug = await prisma.meal.findFirst({
    where: {
      providerProfileId: providerProfile.id,
      slug,
    },
    select: { id: true },
  });

  if (existingSlug) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A meal with this slug already exists",
    );
  }

  const normalizedImages = normalizeImages(payload.images);
  const normalizedVariants = normalizeVariants(payload.variants);
  const {
    mealCategoryCreates,
    categoryIdsToLink,
    categorySlugsToLink,
  } = normalizeCategories(payload.categories, payload.categoryIds);

  const {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink,
    dietaryPreferenceSlugsToLink,
  } = normalizeDietaryPreferences(
    payload.dietaryPreferences,
    payload.dietaryPreferenceIds,
  );

  await ensureCategoryIdsExist(categoryIdsToLink);
  await ensureDietaryPreferenceIdsExist(dietaryPreferenceIdsToLink);

  const data: Prisma.MealCreateInput = {
    title: payload.title,
    slug,
    description: payload.description,
    shortDesc: payload.shortDesc,
    price: payload.price,
    currency: payload.currency,
    stock: payload.stock,
    isActive: payload.isActive ?? true,
    isFeatured: payload.isFeatured ?? false,
    providerProfile: {
      connect: { id: providerProfile.id },
    },
    ...(normalizedImages && { images: { create: normalizedImages } }),
    ...(normalizedVariants && { variants: { create: normalizedVariants } }),
    ...(mealCategoryCreates.length > 0 && {
      categories: { create: mealCategoryCreates },
    }),
    ...(dietaryTagCreates.length > 0 && {
      dietaryTags: { create: dietaryTagCreates },
    }),
  };

  const meal = await prisma.meal.create({ data });

  if (categoryIdsToLink.length > 0 || categorySlugsToLink.length > 0) {
    const slugCategories =
      categorySlugsToLink.length > 0
        ? await prisma.category.findMany({
            where: { slug: { in: categorySlugsToLink } },
            select: { id: true },
          })
        : [];

    const allCategoryIds = new Set<string>(categoryIdsToLink);
    slugCategories.forEach((category) => allCategoryIds.add(category.id));

    if (allCategoryIds.size > 0) {
      await prisma.providerCategory.createMany({
        data: Array.from(allCategoryIds).map((categoryId) => ({
          providerProfileId: providerProfile.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return meal;
};

const updateMeal = async (
  userId: string,
  mealId: string,
  payload: IUpdateMealPayload,
) => {
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  if (payload.price !== undefined) {
    ensureValidPrice(payload.price);
  }
  if (payload.stock !== undefined) {
    ensureValidStock(payload.stock);
  }

  const providerProfile = await getProviderProfileOrThrow(userId);

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerProfileId: providerProfile.id,
      deletedAt: null,
    },
    select: { id: true, slug: true },
  });

  if (!existingMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  const hasCategoryUpdate =
    payload.categoryIds !== undefined || payload.categories !== undefined;
  const hasImageUpdate = payload.images !== undefined;
  const hasVariantUpdate = payload.variants !== undefined;

  let slug: string | undefined;
  if (payload.slug !== undefined) {
    slug = slugify(payload.slug);
    if (!slug) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal slug is invalid");
    }
  }

  if (slug && slug !== existingMeal.slug) {
    const slugExists = await prisma.meal.findFirst({
      where: {
        providerProfileId: providerProfile.id,
        slug,
        id: { not: mealId },
      },
      select: { id: true },
    });
    if (slugExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A meal with this slug already exists",
      );
    }
  }

  const normalizedImages = hasImageUpdate
    ? payload.images?.length
      ? normalizeImages(payload.images)
      : []
    : undefined;

  const normalizedVariants = hasVariantUpdate
    ? payload.variants?.length
      ? normalizeVariants(payload.variants)
      : []
    : undefined;

  const {
    mealCategoryCreates,
    categoryIdsToLink,
    categorySlugsToLink,
  } = hasCategoryUpdate
    ? normalizeCategories(payload.categories, payload.categoryIds)
    : {
        mealCategoryCreates: [],
        categoryIdsToLink: [],
        categorySlugsToLink: [],
      };

  const hasDietaryUpdate =
    payload.dietaryPreferenceIds !== undefined ||
    payload.dietaryPreferences !== undefined;

  const {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink,
    dietaryPreferenceSlugsToLink,
  } = hasDietaryUpdate
    ? normalizeDietaryPreferences(
        payload.dietaryPreferences,
        payload.dietaryPreferenceIds,
      )
    : {
        dietaryTagCreates: [],
        dietaryPreferenceIdsToLink: [],
        dietaryPreferenceSlugsToLink: [],
      };

  if (hasCategoryUpdate) {
    await ensureCategoryIdsExist(categoryIdsToLink);
  }
  if (hasDietaryUpdate) {
    await ensureDietaryPreferenceIdsExist(dietaryPreferenceIdsToLink);
  }

  const data: Prisma.MealUpdateInput = {
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.shortDesc !== undefined && { shortDesc: payload.shortDesc }),
    ...(payload.price !== undefined && { price: payload.price }),
    ...(payload.currency !== undefined && { currency: payload.currency }),
    ...(payload.stock !== undefined && { stock: payload.stock }),
    ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
    ...(slug !== undefined && { slug }),
  };
  if (hasImageUpdate) {
    data.images = {
      deleteMany: {},
      ...(normalizedImages && normalizedImages.length > 0
        ? { create: normalizedImages }
        : {}),
    };
  }

  if (hasVariantUpdate) {
    data.variants = {
      deleteMany: {},
      ...(normalizedVariants && normalizedVariants.length > 0
        ? { create: normalizedVariants }
        : {}),
    };
  }

  if (hasCategoryUpdate) {
    data.categories = {
      deleteMany: {},
      ...(mealCategoryCreates.length > 0 ? { create: mealCategoryCreates } : {}),
    };
  }

  if (hasDietaryUpdate) {
    data.dietaryTags = {
      deleteMany: {},
      ...(dietaryTagCreates.length > 0 ? { create: dietaryTagCreates } : {}),
    };
  }

  if (Object.keys(data).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No meal fields to update");
  }

  const meal = await prisma.meal.update({
    where: { id: mealId },
    data,
  });

  if (
    hasCategoryUpdate &&
    (categoryIdsToLink.length > 0 || categorySlugsToLink.length > 0)
  ) {
    const slugCategories =
      categorySlugsToLink.length > 0
        ? await prisma.category.findMany({
            where: { slug: { in: categorySlugsToLink } },
            select: { id: true },
          })
        : [];

    const allCategoryIds = new Set<string>(categoryIdsToLink);
    slugCategories.forEach((category) => allCategoryIds.add(category.id));

    if (allCategoryIds.size > 0) {
      await prisma.providerCategory.createMany({
        data: Array.from(allCategoryIds).map((categoryId) => ({
          providerProfileId: providerProfile.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return meal;
};

const removeMeal = async (userId: string, mealId: string) => {
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const providerProfile = await getProviderProfileOrThrow(userId);

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerProfileId: providerProfile.id,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!existingMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  const meal = await prisma.meal.update({
    where: { id: mealId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return meal;
};

const updateOrderStatus = async (
  userId: string,
  orderId: string,
  payload: IUpdateOrderStatusPayload,
) => {
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }
  if (!payload?.status) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order status is required");
  }

  const providerProfile = await getProviderProfileOrThrow(userId);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerProfileId: providerProfile.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const allowedStatuses: ProviderOrderStatus[] = [
    "preparing",
    "ready",
    "delivered",
  ];

  if (!allowedStatuses.includes(payload.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid status for provider update",
    );
  }

  const transitions: Record<OrderStatus, ProviderOrderStatus[]> = {
    placed: ["preparing"],
    preparing: ["ready"],
    ready: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const possibleNext = transitions[order.status];
  if (!possibleNext.includes(payload.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change status from ${order.status} to ${payload.status}`,
    );
  }

  const now = new Date();
  const timestampUpdates: Prisma.OrderUpdateInput = {
    ...(payload.status === "preparing" && { preparedAt: now }),
    ...(payload.status === "ready" && { readyAt: now }),
    ...(payload.status === "delivered" && { deliveredAt: now }),
  };

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: payload.status,
      ...timestampUpdates,
    },
  });

  return updatedOrder;
};

export const ProviderServices = {
  getAllProviders: async (query: Record<string, string>) => {
    const { searchTerm, categoryId, isVerified, sort, page, limit } = query;

    const where: Prisma.ProviderProfileWhereInput = {};

    const verifiedFilter = parseBoolean(isVerified);
    where.isVerified = verifiedFilter ?? true;

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    const { page: pageNumber, limit: limitNumber, skip, take } =
      parsePagination(page, limit);

    const orderBy = parseSort(sort);

    const [total, providers] = await prisma.$transaction([
      prisma.providerProfile.count({ where }),
      prisma.providerProfile.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          categories: {
            include: { category: true },
          },
        },
      }),
    ]);

    return {
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage: Math.ceil(total / limitNumber),
      },
      data: providers,
    };
  },
  getProviderWithMenu: async (providerId: string) => {
    if (!providerId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
    }

    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        categories: {
          include: { category: true },
        },
        meals: {
          where: {
            deletedAt: null,
            isActive: true,
          },
          include: {
            images: {
              where: { isPrimary: true },
            },
            categories: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!provider || !provider.isVerified) {
      throw new AppError(httpStatus.NOT_FOUND, "Provider not found");
    }

    return provider;
  },
  createProviderProfile,
  updateProviderProfile,
  addMeal,
  updateMeal,
  removeMeal,
  updateOrderStatus,
};
