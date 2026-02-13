import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../../generated/prisma/browser";
import { Role, UserStatus } from "../user/user.interface";
import type {
  ISuperAdminMealQuery,
  ISuperAdminUpdateRolePayload,
  ISuperAdminUpdateStatusPayload,
} from "./superAdmin.interface";

const userSelect = {
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
} as const;

const parseBoolean = (value?: string) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

const assertSuperAdminRetention = async (targetUserId: string) => {
  const remaining = await prisma.user.count({
    where: {
      role: Role.super_admin,
      isActive: true,
      status: UserStatus.active,
      id: { not: targetUserId },
    },
  });

  if (remaining <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one active super admin must remain",
    );
  }
};

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
      select: userSelect,
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

const getMeals = async (query: ISuperAdminMealQuery) => {
  const { page, limit, searchTerm, providerProfileId, isActive, isVerified } =
    query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const skip = (pageNumber - 1) * limitNumber;

  const activeFilter = parseBoolean(isActive);
  const verifiedFilter = parseBoolean(isVerified);

  const where: Prisma.MealWhereInput = {
    deletedAt: null,
    ...(providerProfileId ? { providerProfileId } : {}),
    ...(activeFilter !== undefined ? { isActive: activeFilter } : {}),
    ...(verifiedFilter !== undefined
      ? { providerProfile: { isVerified: verifiedFilter } }
      : {}),
    ...(searchTerm?.trim()
      ? {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { shortDesc: { contains: searchTerm, mode: "insensitive" } },
            {
              providerProfile: {
                name: { contains: searchTerm, mode: "insensitive" },
              },
            },
          ],
        }
      : {}),
  };

  const [total, meals] = await prisma.$transaction([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        shortDesc: true,
        price: true,
        currency: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        providerProfileId: true,
        providerProfile: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            userId: true,
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
    select: userSelect,
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
    select: { id: true, role: true, isActive: true, status: true },
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
    existingUser.isActive &&
    existingUser.status === UserStatus.active &&
    (payload.status === UserStatus.blocked || payload.isActive === false)
  ) {
    await assertSuperAdminRetention(userId);
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    },
    select: userSelect,
  });
};

const deleteUser = async (actorId: string, userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  if (actorId === userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot delete your own account",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      isActive: true,
      status: true,
      providerProfile: {
        select: { id: true },
      },
    },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    existingUser.role === Role.super_admin &&
    existingUser.isActive &&
    existingUser.status === UserStatus.active
  ) {
    await assertSuperAdminRetention(existingUser.id);
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    if (existingUser.providerProfile?.id) {
      await tx.providerProfile.update({
        where: { id: existingUser.providerProfile.id },
        data: { isVerified: false },
      });

      await tx.meal.updateMany({
        where: {
          providerProfileId: existingUser.providerProfile.id,
          deletedAt: null,
        },
        data: {
          deletedAt: now,
          isActive: false,
        },
      });
    }

    return tx.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.deleted,
        isActive: false,
      },
      select: userSelect,
    });
  });
};

const deleteProvider = async (actorId: string, providerId: string) => {
  if (!providerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          id: true,
          role: true,
          isActive: true,
          status: true,
        },
      },
    },
  });

  if (!provider) {
    throw new AppError(httpStatus.NOT_FOUND, "Provider not found");
  }

  if (provider.userId === actorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot delete your own provider account",
    );
  }

  if (
    provider.user.role === Role.super_admin &&
    provider.user.isActive &&
    provider.user.status === UserStatus.active
  ) {
    await assertSuperAdminRetention(provider.user.id);
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const disabledMeals = await tx.meal.updateMany({
      where: {
        providerProfileId: provider.id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
        isActive: false,
      },
    });

    await tx.providerProfile.update({
      where: { id: provider.id },
      data: { isVerified: false },
    });

    const user = await tx.user.update({
      where: { id: provider.userId },
      data: {
        status: UserStatus.deleted,
        isActive: false,
      },
      select: userSelect,
    });

    return {
      id: provider.id,
      user,
      disabledMeals: disabledMeals.count,
    };
  });
};

const deleteMeal = async (mealId: string) => {
  if (!mealId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
  }

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      providerProfileId: true,
    },
  });

  if (!existingMeal) {
    throw new AppError(httpStatus.NOT_FOUND, "Meal not found");
  }

  const deletedAt = new Date();

  return prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({
      where: { mealId },
    });

    return tx.meal.update({
      where: { id: mealId },
      data: {
        deletedAt,
        isActive: false,
      },
      select: {
        id: true,
        title: true,
        providerProfileId: true,
        isActive: true,
        deletedAt: true,
      },
    });
  });
};

export const SuperAdminServices = {
  getOverview,
  getUsers,
  getMeals,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  deleteProvider,
  deleteMeal,
};
