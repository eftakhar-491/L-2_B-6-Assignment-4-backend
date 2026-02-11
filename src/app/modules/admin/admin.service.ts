import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  ICreateCategoryPayload,
  CategoryStatus,
  IUpdateCategoryPayload,
  IUpdateUserStatusPayload,
  IVerifyProviderPayload,
} from "./admin.interface";
import { Role } from "../user/user.interface";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getAllUsers = async (query: Record<string, string>) => {
  const { page, limit, searchTerm } = query;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const where =
    searchTerm && searchTerm.trim()
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {};

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
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
    data: users,
  };
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  if (payload.status === undefined && payload.isActive === undefined) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Status or active flag is required",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.role === Role.super_admin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Super admin status can only be changed by super admin endpoints",
    );
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const AdminServices = {
  getAllUsers,
  updateUserStatus,
  getAllOrders: async (query: Record<string, string>) => {
    const { page, limit, status, providerProfileId, userId, dateFrom, dateTo } =
      query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {
      ...(status && { status }),
      ...(providerProfileId && { providerProfileId }),
      ...(userId && { userId }),
    };

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : undefined;
      const to = dateTo ? new Date(dateTo) : undefined;
      if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid date range");
      }
      where.placedAt = {
        ...(from && { gte: from }),
        ...(to && { lte: to }),
      };
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
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
      data: orders,
    };
  },
  getAllCategories: async (query: Record<string, string>) => {
    const { page, limit, searchTerm, status } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    if (
      status &&
      !["active", "pending", "rejected"].includes(status)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid category status");
    }

    const where =
      searchTerm && searchTerm.trim()
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { slug: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : {};

    const [total, categories] = await Promise.all([
      prisma.category.count({
        where: {
          ...where,
          ...(status ? { status } : {}),
        },
      }),
      prisma.category.findMany({
        where: {
          ...where,
          ...(status ? { status } : {}),
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage: Math.ceil(total / limitNumber),
      },
      data: categories,
    };
  },
  createCategory: async (
    payload: ICreateCategoryPayload,
    createdByUserId?: string,
  ) => {
    if (!payload?.name?.trim()) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
    }

    const slug = slugify(payload.slug ?? payload.name);
    if (!slug) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category slug is invalid");
    }

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: payload.name }, { slug }],
      },
      select: { id: true },
    });

    if (existing) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category name or slug already exists",
      );
    }

    return prisma.category.create({
      data: {
        name: payload.name.trim(),
        slug,
        description: payload.description,
        status: "active",
        ...(createdByUserId && {
          createdBy: { connect: { id: createdByUserId } },
        }),
      },
    });
  },
  updateCategory: async (
    categoryId: string,
    payload: IUpdateCategoryPayload,
  ) => {
    if (!categoryId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
    }

    if (
      payload.name === undefined &&
      payload.slug === undefined &&
      payload.description === undefined &&
      payload.status === undefined
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "No category fields to update");
    }

    if (payload.name !== undefined && !payload.name.trim()) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
    }

    if (payload.slug !== undefined) {
      const normalized = slugify(payload.slug);
      if (!normalized) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category slug is invalid");
      }
    }

    if (
      payload.status !== undefined &&
      !["active", "pending", "rejected"].includes(payload.status)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid category status");
    }

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, slug: true, name: true },
    });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (payload.name || payload.slug) {
      const duplicate = await prisma.category.findFirst({
        where: {
          OR: [
            ...(payload.name ? [{ name: payload.name }] : []),
            ...(payload.slug ? [{ slug: slugify(payload.slug) }] : []),
          ],
          id: { not: categoryId },
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new AppError(
          httpStatus.CONFLICT,
          "Category name or slug already exists",
        );
      }
    }

    return prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(payload.name !== undefined && { name: payload.name }),
        ...(payload.slug !== undefined && { slug: slugify(payload.slug) }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.status !== undefined && {
          status: payload.status as CategoryStatus,
        }),
      },
    });
  },
  deleteCategory: async (categoryId: string) => {
    if (!categoryId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
    }

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!existing) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { id: categoryId };
  },
  verifyProvider: async (
    providerId: string,
    payload: IVerifyProviderPayload,
  ) => {
    if (!providerId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
    }

    if (payload?.isVerified === undefined) {
      throw new AppError(httpStatus.BAD_REQUEST, "isVerified is required");
    }

    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: { id: true },
    });

    if (!provider) {
      throw new AppError(httpStatus.NOT_FOUND, "Provider not found");
    }

    return prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        isVerified: payload.isVerified,
      },
    });
  },
};
