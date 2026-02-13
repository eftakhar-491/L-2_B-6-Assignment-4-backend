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

const getMeals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const meals = await SuperAdminServices.getMeals(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meals retrieved successfully",
      data: meals.data,
      meta: meals.meta,
    });
  },
);

const updateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actorId = req.user?.id;
    const userId = req.params.id as string;

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
    const userId = req.params.id as string;

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

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actorId = req.user?.id;
    const userId = req.params.id as string;

    if (!actorId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
    }

    const user = await SuperAdminServices.deleteUser(actorId, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User deleted successfully",
      data: user,
    });
  },
);

const deleteProvider = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actorId = req.user?.id;
    const providerId = req.params.id as string;

    if (!actorId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    if (!providerId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
    }

    const result = await SuperAdminServices.deleteProvider(actorId, providerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Provider deleted successfully",
      data: result,
    });
  },
);

const deleteMeal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const mealId = req.params.id as string;

    if (!mealId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal ID is required");
    }

    const meal = await SuperAdminServices.deleteMeal(mealId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal deleted successfully",
      data: meal,
    });
  },
);

export const SuperAdminControllers = {
  getOverview,
  getUsers,
  getMeals,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  deleteProvider,
  deleteMeal,
};
