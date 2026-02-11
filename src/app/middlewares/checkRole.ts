import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import AppError from "../helper/AppError";
import { Role } from "../modules/user/user.interface";

const canAccessRole = (userRole: string, authRoles: string[]) => {
  if (!authRoles.length) return true;
  if (authRoles.includes(userRole)) return true;

  // super_admin inherits admin permissions
  if (userRole === Role.super_admin && authRoles.includes(Role.admin)) {
    return true;
  }

  return false;
};

export const checkRole =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User role or user not found",
      );
    }
    try {
      if (!canAccessRole(role, authRoles)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource",
        );
      }
      next();
    } catch (error) {
      console.log("Role check error", error);
      next(error);
    }
  };
