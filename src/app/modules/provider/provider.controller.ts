import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProviderServices } from "./provider.service";
import type {
  ICreateMealPayload,
  ICreateProviderProfilePayload,
  IUpdateMealPayload,
  IUpdateOrderStatusPayload,
  IUpdateProviderProfilePayload,
} from "./provider.interface";

const addMeal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const meal = await ProviderServices.addMeal(
      userId,
      req.body as ICreateMealPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Meal added successfully",
      data: meal,
    });
  },
);

const updateMeal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const mealId = req.params.id as string;
    const meal = await ProviderServices.updateMeal(
      userId,
      mealId,
      req.body as IUpdateMealPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal updated successfully",
      data: meal,
    });
  },
);

const removeMeal = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const mealId = req.params.id as string;
    const meal = await ProviderServices.removeMeal(userId, mealId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal removed successfully",
      data: meal,
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const orderId = req.params.id as string;
    const updatedOrder = await ProviderServices.updateOrderStatus(
      userId,
      orderId,
      req.body as IUpdateOrderStatusPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  },
);

export const ProviderControllers = {
  getAllProviders: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const providers = await ProviderServices.getAllProviders(
        req.query as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Providers retrieved successfully",
        data: providers.data,
        meta: providers.meta,
      });
    },
  ),
  getProviderWithMenu: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const provider = await ProviderServices.getProviderWithMenu(
        req.params.id as string,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Provider retrieved successfully",
        data: provider,
      });
    },
  ),
  getMyOrders: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.id as string;
      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const orders = await ProviderServices.getMyOrders(
        userId,
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
  createProviderProfile: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.id as string;
      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const profile = await ProviderServices.createProviderProfile(
        userId,
        req.body as ICreateProviderProfilePayload,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Provider profile created successfully",
        data: profile,
      });
    },
  ),
  updateProviderProfile: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.id as string;
      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const profile = await ProviderServices.updateProviderProfile(
        userId,
        req.body as IUpdateProviderProfilePayload,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Provider profile updated successfully",
        data: profile,
      });
    },
  ),
  addMeal,
  updateMeal,
  removeMeal,
  updateOrderStatus,
};
