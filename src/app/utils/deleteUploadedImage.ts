import fs from "fs/promises";
import cloudinary from "../lib/cloudinary";

type StorageType = "local" | "cloudinary";

export const deleteUploadedImage = async (
  file: Express.Multer.File,
  storageType: StorageType,
) => {
  try {
    if (storageType === "cloudinary") {
      if (file.filename) {
        await cloudinary.uploader.destroy(file.filename);
      }
      return;
    }

    if (storageType === "local" && file.path) {
      await fs.unlink(file.path);
    }
  } catch (error: any) {
    console.error("Image cleanup failed:", error.message);
  }
};
