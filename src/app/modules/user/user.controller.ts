import type { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../helper/AppError";

import { type IUser } from "./user.interface";

// const updateUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id;
//     const token = req.headers.authorization;
//     const verifiedToken = verifyToken(
//       token as string,
//       envVars.JWT_ACCESS_SECRET as string
//     ) as JwtPayload;

//     // const verifiedToken = req.user;
//     let user;
//     const payload = req.body;

//     const userRole = (req.user as JwtPayload).role as string;

//     switch (userRole) {
//       case Role.RIDER:
//         // Handle rider specific logic
//         user = await UserServices.updateUser(
//           userId,
//           payload,
//           verifiedToken as JwtPayload,
//           Rider
//         );
//         break;
//       case Role.DRIVER:
//         // Handle driver specific logic
//         user = await UserServices.updateUser(
//           userId,
//           payload,
//           verifiedToken as JwtPayload,
//           Driver
//         );
//         break;
//       case Role.ADMIN:
//         user = await UserServices.updateUser(
//           userId,
//           payload,
//           verifiedToken as JwtPayload,
//           Admin
//         );

//         break;
//       default:
//         throw new AppError(httpStatus.FORBIDDEN, "Invalid user role");
//     }

//     // res.status(httpStatus.CREATED).json({
//     //     message: "User Created Successfully",
//     //     user
//     // })

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "User Updated Successfully",
//       data: user,
//     });
//   }
// );

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    try {
      const users = await UserServices.getAllUsers(
        query as Record<string, string>,
      );
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: users.data,
        meta: users.meta,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving users",
      );
    }
  },
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedHeader = req.user;
    if (!decodedHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    try {
      const user = await UserServices.getMe(
        req.headers as Record<string, string>,
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: user,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving your profile",
      );
    }
  },
);
const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      phone,
      image,
      status: bodyStatus,
      isActive,
      addresses,
      providerProfile,
    } = req.body;

    const status = bodyStatus == "deleted" ? bodyStatus : null;

    const decodedHeader = req.user;

    if (!decodedHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    try {
      const updatedUser = await UserServices.updateMe(
        (decodedHeader as IUser).id,
        { name, phone, image, status, isActive, addresses, providerProfile },
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Updated Successfully",
        data: updatedUser,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while updating your profile",
      );
    }
  },
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User ID is required from params",
      );
    }
    try {
      const user = await UserServices.getSingleUser(id);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: user,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving the user",
      );
    }
  },
);
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const { name, role, emailVerified, status, phone } = req.body;

    if (!userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User ID is required from params",
      );
    }
    try {
      const user = await UserServices.updateUser(userId, {
        name,
        role,
        emailVerified,
        status,
        phone,
      });

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, "User not found"));
      }

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Data Updated Successfully",
        data: user,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while updating the user data",
      );
    }
  },
);
export const UserControllers = {
  getAllUsers,
  updateMe,
  getSingleUser,
  getMe,
  updateUser,
};
