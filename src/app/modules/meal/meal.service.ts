import httpStatus from "http-status-codes";
import type { Prisma } from "../../../../generated/prisma/browser";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { IMealFilters } from "./meal.interface";

const parseBoolean = (value?: string) => {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const parseNumber = (value?: string) => {
  if (value === undefined) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const parseSort = (
  sort: string | undefined,
): Prisma.MealOrderByWithRelationInput[] => {
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

const getAllMeals = async (query: IMealFilters) => {
  const {
    searchTerm,
    providerId,
    providerProfileId,
    categoryId,
    minPrice,
    maxPrice,
    isFeatured,
    isActive,
    sort,
    page,
    limit,
  } = query;

  const where: Prisma.MealWhereInput = {
    deletedAt: null,
  };

  const activeFilter = parseBoolean(isActive);
  where.isActive = activeFilter ?? true;

  const featuredFilter = parseBoolean(isFeatured);
  if (featuredFilter !== undefined) {
    where.isFeatured = featuredFilter;
  }

  const providerFilter = providerId || providerProfileId;
  if (providerFilter) {
    where.providerProfileId = providerFilter;
  }

  if (categoryId) {
    where.categories = {
      some: {
        categoryId,
      },
    };
  }

  const min = parseNumber(minPrice);
  const max = parseNumber(maxPrice);
  if (min !== undefined || max !== undefined) {
    where.price = {
      ...(min !== undefined && { gte: min }),
      ...(max !== undefined && { lte: max }),
    };
  }

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { shortDesc: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  const { page: pageNumber, limit: limitNumber, skip, take } = parsePagination(
    page,
    limit,
  );

  const orderBy = parseSort(sort);

  const [total, meals] = await prisma.$transaction([
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
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
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
