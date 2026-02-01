import type { Request, Response, NextFunction } from "express";
import { uploadProductImage, uploadWithCloudinary } from "../lib/multer";
import AppError from "../helper/AppError";
import httpStatus from "http-status-codes";

export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const storageType = req.query.storageType as
    | "local"
    | "cloudinary"
    | "custom"
    | undefined;

  req.uploadedImages = [];

  if (!storageType) return next();

  // ✅ CUSTOM (already uploaded elsewhere)
  if (storageType === "custom") {
    if (!Array.isArray(req.body.images)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Images array required");
    }

    req.body.images.forEach((img: any) => {
      if (!img.src || !img.publicId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Custom image src and publicId required",
        );
      }

      req.uploadedImages!.push({
        storageType: "custom",
        src: img.src,
        publicId: img.publicId,
      });
    });

    return next();
  }

  // ✅ LOCAL / CLOUDINARY
  const uploader =
    storageType === "cloudinary" ? uploadWithCloudinary : uploadProductImage;

  uploader.array("images", 10)(req, res, (err) => {
    if (err) return next(err);

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        req.uploadedImages!.push({
          storageType,
          src: file.path,
          publicId: file.filename,
        });
      });
    }

    next();
  });
};

// // category.upload.ts
// import type { NextFunction, Request, Response } from "express";
// import { uploadProductImage, uploadWithCloudinary } from "../lib/multer";
// import AppError from "../helper/AppError";
// import httpStatus from "http-status-codes";

// export const uploadImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const storageType = req.query.storageType as
//     | "local"
//     | "cloudinary"
//     | "custom"
//     | undefined;

//   if (!storageType) {
//     return next();
//   }

//   if (storageType === "custom") {
//     if (!req.body.src || !req.body.publicId) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Custom image src and publicId required",
//       );
//     }
//     next();
//     return;
//   }

//   if (storageType === "cloudinary") {
//     await uploadWithCloudinary.single("image")(req, res, next);

//     return;
//   }
//   if (storageType === "local" || !storageType) {
//     await uploadProductImage.single("image")(req, res, next);
//     return;
//   }
// };
