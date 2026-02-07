import type { UserStatus } from "../user/user.interface";

export interface IUpdateUserStatusPayload {
  status?: UserStatus;
  isActive?: boolean;
}

export interface IVerifyProviderPayload {
  isVerified: boolean;
}

export type CategoryStatus = "active" | "pending" | "rejected";

export interface ICreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  status?: CategoryStatus;
}
