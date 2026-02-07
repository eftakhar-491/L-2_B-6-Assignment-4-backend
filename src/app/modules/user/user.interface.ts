export enum Role {
  customer = "customer",
  provider = "provider",
  admin = "admin",
}

export enum UserStatus {
  active = "active",
  blocked = "blocked",
  pending = "pending",
  deleted = "deleted",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  phone: string;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAddressPayload {
  label?: string;
  fullAddress: string;
  lat?: number | string | null;
  lng?: number | string | null;
  phone?: string | null;
}

export interface IUpdateAddressPayload {
  label?: string | null;
  fullAddress?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  phone?: string | null;
}
