import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: string;
        emailVerified: boolean;
        phone?: string;
        status?: string;
      };
      file?: {
        path: string;
        filename: string;
        public_id: string;
      };
      uploadedImages?: {
        storageType?: "local" | "cloudinary" | "custom";
        src?: string;
        publicId?: string;
      }[];
    }
  }
}
export {};
