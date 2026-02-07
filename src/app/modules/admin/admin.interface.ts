import type { UserStatus } from "../user/user.interface";

export interface IUpdateUserStatusPayload {
  status?: UserStatus;
  isActive?: boolean;
}

export interface IVerifyProviderPayload {
  isVerified: boolean;
}
