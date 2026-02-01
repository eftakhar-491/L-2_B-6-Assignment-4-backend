import httpStatus from "http-status-codes";

import { auth } from "../lib/auth";

import type { NextFunction, Request, Response } from "express";
import { UserStatus } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      if (session?.user && !authRoles.includes(session.user.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      if (!session?.user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "You are not authorized",
        });
      }
      if (!session.user.emailVerified) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Please verify your email to proceed",
        });
      }

      if (session.user.status === UserStatus.BLOCKED) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been blocked. Please contact support.",
        });
      }
      if (session.user.status === UserStatus.DELETED) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been deleted. Please contact support.",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        phone: session.user.phone,
        status: session.user.status as UserStatus,
      };

      next();
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };
