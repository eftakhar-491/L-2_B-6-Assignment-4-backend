import fs from "fs/promises";
import cloudinary from "../lib/cloudinary";

export const cleanupImages = async (
  images?:
    | {
        storageType: "local" | "cloudinary" | "custom";
        src?: string;
        publicId?: string;
      }[]
    | undefined,
) => {
  if (!images) return;
  if (!images?.length) return;

  for (const image of images) {
    try {
      if (image.storageType === "local" && image.src) {
        await fs.unlink(image.src);
      }

      if (image.storageType === "cloudinary" && image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    } catch (err) {
      console.error("Failed to cleanup image:", err);
    }
  }
};

// import fs from "fs/promises";
// import cloudinary from "../lib/cloudinary";

// type CleanupPayload = {
//   storageType?: "local" | "cloudinary" | "custom";
//   src?: string;
//   publicId?: string;
// };

// export const cleanupImage = async (image?: CleanupPayload) => {
//   if (!image || image.storageType === "custom") return;

//   try {
//     if (image.storageType === "local" && image.src) {
//       await fs.unlink(image.src);
//     }

//     if (image.storageType === "cloudinary" && image.publicId) {
//       await cloudinary.uploader.destroy(image.publicId);
//     }
//   } catch (err) {
//     console.error("Image cleanup failed:", err);
//   }
// };
