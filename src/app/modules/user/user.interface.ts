export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
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
