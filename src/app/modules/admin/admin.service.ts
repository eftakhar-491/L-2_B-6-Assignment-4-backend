import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type {
  IUpdateUserStatusPayload,
  IVerifyProviderPayload,
} from "./admin.interface";

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
