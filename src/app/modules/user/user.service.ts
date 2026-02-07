import AppError from "../../helper/AppError";
import httpStatus from "http-status-codes";
import { userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { Prisma } from "../../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import type {
  ICreateAddressPayload,
  IUpdateAddressPayload,
  IUser,
  Role,
  UserStatus,
} from "./user.interface";

export const getAllUsers = async (query: Record<string, string>) => {
  const qb = new QueryBuilder<
    Prisma.UserWhereInput,
    Prisma.UserSelect,
    Prisma.UserOrderByWithRelationInput[]
  >(query)
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const users = await prisma.user.findMany(
    qb.build() as Prisma.UserFindManyArgs,
  );

  const meta = await qb.getMeta(prisma.user);

  return {
    meta,
    data: users,
  };
};
const getMe = async (headers: Record<string, string>) => {
  const session = await auth.api.getSession({
    headers: headers,
  });

  if (!session?.user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return session.user;
};

const updateMe = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    image?: string | null;
    status?: UserStatus | null;
    isActive?: boolean;
    addresses?: Array<
      Pick<
        Prisma.AddressUpdateManyMutationInput,
        "label" | "fullAddress" | "lat" | "lng" | "phone"
      >
    >;
    providerProfile?: Prisma.ProviderProfileUpdateOneWithoutUserNestedInput;
  },
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },

    data: {
      name: payload.name ?? existingUser.name,
      phone: payload.phone ?? existingUser.phone,
      image: payload.image ?? existingUser.image,
      status: payload.status ?? existingUser.status,
      isActive: payload.isActive ?? existingUser.isActive,
      ...(payload.providerProfile && { providerProfile: payload.providerProfile }),
    },

    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      isSubscribed: true,
      image: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const addressData = payload.addresses;
  if (addressData?.length) {
    await prisma.address.deleteMany({
      where: { userId: userId },
    });
    await prisma.address.createMany({
      data: addressData.map((address) => ({
        userId,
        label: address.label ?? null,
        fullAddress: address.fullAddress,
        lat: address.lat ?? null,
        lng: address.lng ?? null,
        phone: address.phone ?? null,
      })),
    });
  }

  return updatedUser;
};
const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      isSubscribed: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.role !== undefined && { role: payload.role as Role }),
      ...(payload.emailVerified !== undefined && {
        emailVerified: payload.emailVerified,
      }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      isSubscribed: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

const createAddress = async (
  userId: string,
  payload: ICreateAddressPayload,
) => {
  if (!payload?.fullAddress?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Full address is required");
  }

  const address = await prisma.address.create({
    data: {
      user: { connect: { id: userId } },
      label: payload.label ?? null,
      fullAddress: payload.fullAddress,
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      phone: payload.phone ?? null,
    },
  });

  return address;
};

const getMyAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

const updateAddress = async (
  userId: string,
  addressId: string,
  payload: IUpdateAddressPayload,
) => {
  if (!addressId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Address ID is required");
  }

  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  if (
    payload.label === undefined &&
    payload.fullAddress === undefined &&
    payload.lat === undefined &&
    payload.lng === undefined &&
    payload.phone === undefined
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "No address fields to update");
  }

  return prisma.address.update({
    where: { id: addressId },
    data: {
      ...(payload.label !== undefined && { label: payload.label }),
      ...(payload.fullAddress !== undefined && {
        fullAddress: payload.fullAddress,
      }),
      ...(payload.lat !== undefined && { lat: payload.lat }),
      ...(payload.lng !== undefined && { lng: payload.lng }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
    },
  });
};

const deleteAddress = async (userId: string, addressId: string) => {
  if (!addressId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Address ID is required");
  }

  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  return { id: addressId };
};

export const UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  updateMe,
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
};
