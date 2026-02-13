import type { Role, UserStatus } from "../user/user.interface";

export interface ISuperAdminUpdateRolePayload {
  role: Role;
}

export interface ISuperAdminUpdateStatusPayload {
  status?: UserStatus;
  isActive?: boolean;
}

export interface ISuperAdminMealQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  providerProfileId?: string;
  isActive?: string;
  isVerified?: string;
}
