import type { Request, Response, NextFunction } from "express";

import { uploadProductImage, uploadWithCloudinary } from "../lib/multer";
import AppError from "../helper/AppError";

export const checkStorageAndUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const storageType = req.query.storageType as
    | "local"
    | "cloudinary"
    | "custom";

  if (storageType === "cloudinary") {
    uploadWithCloudinary.single("image")(req, res, next);
  }
  if (storageType === "local") {
    uploadProductImage.single("image")(req, res, next);
  }
  if (storageType === "custom") {
    return next();
  }
};
