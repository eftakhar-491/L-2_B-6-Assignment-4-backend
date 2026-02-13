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
  ICreateProviderCategoryPayload,
  OrderStatus,
  ProviderOrderStatus,
} from "./provider.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
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
    throw new AppError(httpStatus.CONFLICT, "Provider profile already exists");
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
  const slugSet = new Set<string>();

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

    slugSet.add(slug);
  });

  return {
    categoryIdsToLink: Array.from(idSet),
    categorySlugsToLink: Array.from(slugSet),
  };
};

const resolveActiveCategoryIds = async (
  categoryIds: string[],
  categorySlugs: string[],
) => {
  if (!categoryIds.length && !categorySlugs.length) {
    return [];
  }

  const or: Prisma.CategoryWhereInput[] = [];
  if (categoryIds.length) {
    or.push({ id: { in: categoryIds } });
  }
  if (categorySlugs.length) {
    or.push({ slug: { in: categorySlugs } });
  }

  const categories = await prisma.category.findMany({
    where: {
      status: "active",
      OR: or,
    },
    select: { id: true, slug: true },
  });

  const foundIds = new Set(categories.map((category) => category.id));
  const foundSlugs = new Set(categories.map((category) => category.slug));

  categoryIds.forEach((id) => {
    if (!foundIds.has(id)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Category not found or not approved",
      );
    }
  });

  categorySlugs.forEach((slug) => {
    if (!foundSlugs.has(slug)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Category not found or not approved",
      );
    }
  });

  return categories.map((category) => category.id);
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
  const { categoryIdsToLink, categorySlugsToLink } = normalizeCategories(
    payload.categories,
    payload.categoryIds,
  );

  const {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink,
    dietaryPreferenceSlugsToLink,
  } = normalizeDietaryPreferences(
    payload.dietaryPreferences,
    payload.dietaryPreferenceIds,
  );

  const resolvedCategoryIds = await resolveActiveCategoryIds(
    categoryIdsToLink,
    categorySlugsToLink,
  );
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
    ...(resolvedCategoryIds.length > 0 && {
      categories: {
        create: resolvedCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
    }),
    ...(dietaryTagCreates.length > 0 && {
      dietaryTags: { create: dietaryTagCreates },
    }),
  };

  const meal = await prisma.meal.create({ data });

  if (resolvedCategoryIds.length > 0) {
    await prisma.providerCategory.createMany({
      data: resolvedCategoryIds.map((categoryId) => ({
        providerProfileId: providerProfile.id,
        categoryId,
      })),
      skipDuplicates: true,
    });
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

  const { categoryIdsToLink, categorySlugsToLink } = hasCategoryUpdate
    ? normalizeCategories(payload.categories, payload.categoryIds)
    : {
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

  const resolvedCategoryIds = hasCategoryUpdate
    ? await resolveActiveCategoryIds(categoryIdsToLink, categorySlugsToLink)
    : [];
  if (hasDietaryUpdate) {
    await ensureDietaryPreferenceIdsExist(dietaryPreferenceIdsToLink);
  }

  const data: Prisma.MealUpdateInput = {
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && {
      description: payload.description,
    }),
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
      ...(resolvedCategoryIds.length > 0
        ? {
            create: resolvedCategoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          }
        : {}),
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

  if (hasCategoryUpdate && resolvedCategoryIds.length > 0) {
    await prisma.providerCategory.createMany({
      data: resolvedCategoryIds.map((categoryId) => ({
        providerProfileId: providerProfile.id,
        categoryId,
      })),
      skipDuplicates: true,
    });
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

const getAllProviders = async (query: Record<string, string>) => {
  const { categoryId, isVerified } = query;

  const qb = new QueryBuilder<
    Prisma.ProviderProfileWhereInput,
    Prisma.ProviderProfileSelect,
    Prisma.ProviderProfileOrderByWithRelationInput[]
  >(query)
    // searchTerm is handled here
    .search(["name", "description", "address"])
    // filter() will copy other query fields except excludeField
    .filter()
    .sort()
    .paginate();

  const built = qb.build();

  // ✅ enforce verified default = true (your previous behavior)
  const verifiedFilter = parseBoolean(isVerified);
  built.where.isVerified = verifiedFilter ?? true;
  built.where.user = {
    status: {
      not: "deleted",
    },
  };

  // ✅ relational filter for category
  if (categoryId) {
    built.where.categories = {
      some: { categoryId },
    };
  }

  // ✅ include relations
  const findQuery: Prisma.ProviderProfileFindManyArgs = {
    ...built,
    include: {
      categories: { include: { category: true } },
    },
  };

  // ✅ IMPORTANT: do NOT count inside a DB transaction (see error section below)
  const [total, providers] = await Promise.all([
    prisma.providerProfile.count({ where: built.where }),
    prisma.providerProfile.findMany(findQuery),
  ]);

  const pageNumber = Number(query.page) || 1;
  const limitNumber = Number(query.limit) || 10;

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: providers,
  };
};

const getProviderWithMenu = async (providerId: string) => {
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
};

const getMyMeals = async (userId: string, query: Record<string, string>) => {
  const providerProfile = await getProviderProfileOrThrow(userId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const activeFilter = parseBoolean(query.isActive);
  const searchTerm = query.searchTerm?.trim();

  const where: Prisma.MealWhereInput = {
    providerProfileId: providerProfile.id,
    deletedAt: null,
    ...(activeFilter !== undefined ? { isActive: activeFilter } : {}),
    ...(searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { shortDesc: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, meals] = await Promise.all([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        categories: {
          include: { category: true },
        },
        variants: {
          include: { options: true },
        },
        dietaryTags: {
          include: { dietaryPreference: true },
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
    data: meals,
  };
};

const getMyMealById = async (userId: string, mealId: string) => {
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const providerProfile = await getProviderProfileOrThrow(userId);

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerProfileId: providerProfile.id,
      deletedAt: null,
    },
    include: {
      images: true,
      categories: {
        include: { category: true },
      },
      variants: {
        include: { options: true },
      },
      dietaryTags: {
        include: { dietaryPreference: true },
      },
    },
  });

  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  return meal;
};

const createCategoryRequest = async (
  userId: string,
  payload: ICreateProviderCategoryPayload,
) => {
  await ensureProviderRole(userId);

  if (!payload?.name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
  }

  const slug = slugify(payload.slug ?? payload.name);
  if (!slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category slug is invalid");
  }

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: payload.name.trim() }, { slug }],
    },
    select: { id: true, status: true },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists or pending approval",
    );
  }

  return prisma.category.create({
    data: {
      name: payload.name.trim(),
      slug,
      description: payload.description,
      status: "pending",
      createdBy: { connect: { id: userId } },
    },
  });
};

const getMyCategories = async (
  userId: string,
  query: Record<string, string>,
) => {
  await ensureProviderRole(userId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const status = query.status as "active" | "pending" | "rejected" | undefined;
  if (status && !["active", "pending", "rejected"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid category status");
  }

  const where: Prisma.CategoryWhereInput = {
    createdByUserId: userId,
    ...(status ? { status } : {}),
  };

  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: categories,
  };
};

const getMyOrders = async (userId: string, query: Record<string, string>) => {
  const providerProfile = await getProviderProfileOrThrow(userId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const status = query.status as OrderStatus | undefined;
  const where: Prisma.OrderWhereInput = {
    providerProfileId: providerProfile.id,
    ...(status && { status }),
  };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { placedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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

export const ProviderServices = {
  getProviderWithMenu,
  getAllProviders,
  getMyMeals,
  getMyMealById,
  getMyOrders,
  createCategoryRequest,
  getMyCategories,
  createProviderProfile,
  updateProviderProfile,
  addMeal,
  updateMeal,
  removeMeal,
  updateOrderStatus,
};
