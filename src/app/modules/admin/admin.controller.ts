import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";
import type {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
  IUpdateUserStatusPayload,
  IVerifyProviderPayload,
} from "./admin.interface";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await AdminServices.getAllUsers(
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

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
    }

    const user = await AdminServices.updateUserStatus(
      userId,
      req.body as IUpdateUserStatusPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: user,
    });
  },
);

export const AdminControllers = {
  getAllUsers,
  updateUserStatus,
  getAllOrders: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const orders = await AdminServices.getAllOrders(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Orders retrieved successfully",
        data: orders.data,
        meta: orders.meta,
      });
    },
  ),
  getAllCategories: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories = await AdminServices.getAllCategories(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: categories.data,
        meta: categories.meta,
      });
    },
  ),
  createCategory: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const adminId = req.user?.id;
      const category = await AdminServices.createCategory(
        req.body as ICreateCategoryPayload,
        adminId,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: category,
      });
    },
  ),
  updateCategory: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
      }

      const category = await AdminServices.updateCategory(
        categoryId,
        req.body as IUpdateCategoryPayload,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category updated successfully",
        data: category,
      });
    },
  ),
  deleteCategory: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required");
      }

      const result = await AdminServices.deleteCategory(categoryId);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully",
        data: result,
      });
    },
  ),
  verifyProvider: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const providerId = req.params.id;
      if (!providerId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Provider ID is required");
      }

      const provider = await AdminServices.verifyProvider(
        providerId,
        req.body as IVerifyProviderPayload,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Provider verification updated successfully",
        data: provider,
      });
    },
  ),
};
