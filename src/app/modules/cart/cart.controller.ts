import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CartServices } from "./cart.service";
import type {
  IAddCartItemPayload,
  IUpdateCartItemPayload,
} from "./cart.interface";

const getCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const cart = await CartServices.getCart(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart retrieved successfully",
      data: cart,
    });
  },
);

const addItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const item = await CartServices.addItem(
      userId,
      req.body as IAddCartItemPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Item added to cart",
      data: item,
    });
  },
);

const updateItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const item = await CartServices.updateItem(
      userId,
      req.params.id as string,
      req.body as IUpdateCartItemPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item updated",
      data: item,
    });
  },
);

const removeItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const result = await CartServices.removeItem(
      userId,
      req.params.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item removed",
      data: result,
    });
  },
);

const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    const result = await CartServices.clearCart(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart cleared",
      data: result,
    });
  },
);

export const CartControllers = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
