// category.upload.ts
import type { NextFunction, Request, Response } from "express";
import { uploadProductImage, uploadWithCloudinary } from "../lib/multer";
import AppError from "../helper/AppError";
import httpStatus from "http-status-codes";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const storageType = req.query.storageType as
    | "local"
    | "cloudinary"
    | "custom"
    | undefined;

  if (!storageType) {
    return next();
  }

  if (storageType === "custom") {
    if (!req.body.src || !req.body.publicId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Custom image src and publicId required",
      );
    }
    next();
    return;
  }

  if (storageType === "cloudinary") {
    await uploadWithCloudinary.single("image")(req, res, next);

    return;
  }
  if (storageType === "local" || !storageType) {
    await uploadProductImage.single("image")(req, res, next);
    return;
  }
};
