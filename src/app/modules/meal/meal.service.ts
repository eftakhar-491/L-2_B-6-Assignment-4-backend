import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/browser";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { IMealFilters } from "./meal.interface";

const parseBoolean = (value?: string) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

const parseNumber = (value?: string) => {
  if (value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseDietarySlugs = (value?: string) => {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => toSlug(entry))
        .filter(Boolean),
    ),
  );
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

const buildMealQuery = (query: IMealFilters) => {
  const qbQuery: Record<string, string | undefined> = {
    searchTerm: query.searchTerm,
    sort: query.sort,
    page: query.page,
    limit: query.limit,
  };

  const providerFilter = query.providerProfileId || query.providerId;
  if (providerFilter) {
    qbQuery.providerProfileId = providerFilter;
  }

  const qb = new QueryBuilder<
    Prisma.MealWhereInput,
    Prisma.MealSelect,
    Prisma.MealOrderByWithRelationInput[]
  >(qbQuery)
    .filter()
    .search(["title", "description", "shortDesc"])
    .sort()
    .paginate();

  const built = qb.build() as Prisma.MealFindManyArgs;

  const where: Prisma.MealWhereInput = {
    ...(built.where ?? {}),
    deletedAt: null,
  };

  const active = parseBoolean(query.isActive);
  where.isActive = active ?? true;

  const featured = parseBoolean(query.isFeatured);
  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  if (query.categoryId) {
    where.categories = {
      some: {
        categoryId: query.categoryId,
      },
    };
  }

  const dietarySlugs = parseDietarySlugs(query.dietary);
  if (dietarySlugs.length > 0) {
    where.dietaryTags = {
      some: {
        dietaryPreference: {
          slug: {
            in: dietarySlugs,
          },
        },
      },
    };
  }

  const min = parseNumber(query.minPrice);
  const max = parseNumber(query.maxPrice);
  if (min !== undefined || max !== undefined) {
    where.price = {
      ...(min !== undefined && { gte: min }),
      ...(max !== undefined && { lte: max }),
    };
  }

  return {
    where,
    orderBy: built.orderBy,
    skip: built.skip,
    take: built.take,
  };
};

const getAllMeals = async (query: IMealFilters) => {
  const { where, orderBy, skip, take } = buildMealQuery(query);
  const { page, limit } = parsePagination(query.page, query.limit);

  const [total, meals] = await Promise.all([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true,
            rating: true,
            isVerified: true,
          },
        },
        images: {
          where: { isPrimary: true },
          select: {
            id: true,
            src: true,
            altText: true,
            isPrimary: true,
          },
        },
        categories: {
          include: {
            category: true,
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
    data: meals,
  };
};

const getMealById = async (mealId: string) => {
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      deletedAt: null,
      isActive: true,
    },
    include: {
      providerProfile: {
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          website: true,
          logoSrc: true,
          rating: true,
          isVerified: true,
        },
      },
      images: true,
      variants: {
        include: {
          options: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      dietaryTags: {
        include: {
          dietaryPreference: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!meal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  return meal;
};

export const MealServices = {
  getAllMeals,
  getMealById,
};
