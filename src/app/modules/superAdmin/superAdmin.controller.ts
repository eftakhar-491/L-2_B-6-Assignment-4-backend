import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SuperAdminServices } from "./superAdmin.service";
import type {
  ISuperAdminUpdateRolePayload,
  ISuperAdminUpdateStatusPayload,
} from "./superAdmin.interface";

const getOverview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const overview = await SuperAdminServices.getOverview();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Super admin overview retrieved successfully",
      data: overview,
    });
  },
);

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await SuperAdminServices.getUsers(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users.data,
      meta: users.meta,
    });
  },
);

const updateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actorId = req.user?.id;
    const userId = req.params.id;

    if (!actorId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
    }

    const user = await SuperAdminServices.updateUserRole(
      actorId,
      userId,
      req.body as ISuperAdminUpdateRolePayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User role updated successfully",
      data: user,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actorId = req.user?.id;
    const userId = req.params.id;

    if (!actorId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
    }

    const user = await SuperAdminServices.updateUserStatus(
      actorId,
      userId,
      req.body as ISuperAdminUpdateStatusPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: user,
    });
  },
);

export const SuperAdminControllers = {
  getOverview,
  getUsers,
  updateUserRole,
  updateUserStatus,
};
