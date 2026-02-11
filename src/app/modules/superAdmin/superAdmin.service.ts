import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/browser";
import { Role, UserStatus } from "../user/user.interface";
import type {
  ISuperAdminUpdateRolePayload,
  ISuperAdminUpdateStatusPayload,
} from "./superAdmin.interface";

const getOverview = async () => {
  const [
    totalUsers,
    customerUsers,
    providerUsers,
    adminUsers,
    superAdminUsers,
    activeUsers,
    pendingUsers,
    blockedUsers,
    deletedUsers,
    totalProviders,
    verifiedProviders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.customer } }),
    prisma.user.count({ where: { role: Role.provider } }),
    prisma.user.count({ where: { role: Role.admin } }),
    prisma.user.count({ where: { role: Role.super_admin } }),
    prisma.user.count({ where: { status: UserStatus.active } }),
    prisma.user.count({ where: { status: UserStatus.pending } }),
    prisma.user.count({ where: { status: UserStatus.blocked } }),
    prisma.user.count({ where: { status: UserStatus.deleted } }),
    prisma.providerProfile.count(),
    prisma.providerProfile.count({ where: { isVerified: true } }),
  ]);

  return {
    users: {
      total: totalUsers,
      byRole: {
        customer: customerUsers,
        provider: providerUsers,
        admin: adminUsers,
        super_admin: superAdminUsers,
      },
      byStatus: {
        active: activeUsers,
        pending: pendingUsers,
        blocked: blockedUsers,
        deleted: deletedUsers,
      },
    },
    providers: {
      total: totalProviders,
      verified: verifiedProviders,
      unverified: totalProviders - verifiedProviders,
    },
  };
};

const getUsers = async (query: Record<string, string>) => {
  const { page, limit, searchTerm, role, status } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  if (role && !Object.values(Role).includes(role as Role)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  if (status && !Object.values(UserStatus).includes(status as UserStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user status");
  }

  const where: Prisma.UserWhereInput = {
    ...(role ? { role: role as Role } : {}),
    ...(status ? { status: status as UserStatus } : {}),
    ...(searchTerm?.trim()
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
          ],
        }
      : {}),
  };

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

const updateUserRole = async (
  actorId: string,
  userId: string,
  payload: ISuperAdminUpdateRolePayload,
) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  if (!payload?.role || !Object.values(Role).includes(payload.role)) {
    throw new AppError(httpStatus.BAD_REQUEST, "A valid role is required");
  }

  if (actorId === userId && payload.role !== Role.super_admin) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot demote your own super admin role",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: payload.role },
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

const updateUserStatus = async (
  actorId: string,
  userId: string,
  payload: ISuperAdminUpdateStatusPayload,
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

  if (
    payload.status !== undefined &&
    !Object.values(UserStatus).includes(payload.status)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user status");
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    actorId === userId &&
    (payload.status === UserStatus.blocked || payload.isActive === false)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot block or deactivate your own account",
    );
  }

  if (
    existingUser.role === Role.super_admin &&
    (payload.status === UserStatus.blocked || payload.isActive === false)
  ) {
    const activeSuperAdmins = await prisma.user.count({
      where: {
        role: Role.super_admin,
        isActive: true,
        status: UserStatus.active,
      },
    });

    if (activeSuperAdmins <= 1) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "At least one active super admin must remain",
      );
    }
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

export const SuperAdminServices = {
  getOverview,
  getUsers,
  updateUserRole,
  updateUserStatus,
};
