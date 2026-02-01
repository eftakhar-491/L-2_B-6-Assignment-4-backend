// category.upload.ts
import type { Request } from "express";
import httpStatus from "http-status-codes";
import AppError from "./AppError";
import { uploadProductImage, uploadWithCloudinary } from "../lib/multer";

export const uploadCategoryImageIfAny = async (
  req: Request,
  storageType?: "local" | "cloudinary" | "custom",
) => {
  if (!storageType) return null;

  if (storageType === "custom") {
    if (!req.body.src || !req.body.publicId) return null;

    return {
      src: req.body.src,
      publicId: req.body.publicId,
      altText: req.body.altText || null,
    };
  }

  const uploader =
    storageType === "cloudinary" ? uploadWithCloudinary : uploadProductImage;

  await new Promise<void>((resolve, reject) => {
    uploader.single("image")(req, {} as any, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  if (!req.file) return null;

  return {
    src: req.file.path,
    publicId: req.file.filename,
    altText: req.body.name || null,
  };
};
