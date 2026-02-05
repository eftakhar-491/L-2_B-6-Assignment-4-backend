import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { MealServices } from "./meal.service";

const getAllMeals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const meals = await MealServices.getAllMeals(
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

const getMealById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const meal = await MealServices.getMealById(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal retrieved successfully",
      data: meal,
    });
  },
);

export const MealControllers = {
  getAllMeals,
  getMealById,
};
