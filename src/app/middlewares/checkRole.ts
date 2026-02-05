import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import AppError from "../helper/AppError";

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
      if (!authRoles.includes(role)) {
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
