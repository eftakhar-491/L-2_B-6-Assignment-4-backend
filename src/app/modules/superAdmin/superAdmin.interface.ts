import type { Role, UserStatus } from "../user/user.interface";

export interface ISuperAdminUpdateRolePayload {
  role: Role;
}

export interface ISuperAdminUpdateStatusPayload {
  status?: UserStatus;
  isActive?: boolean;
}
