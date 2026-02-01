import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const CloudinaryStorageInstance = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

export const uploadWithCloudinary = multer({
  storage: CloudinaryStorageInstance,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/images"));
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
