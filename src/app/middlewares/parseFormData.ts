import { Request, Response, NextFunction } from "express";

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    const jsonFields = ["variants", "images"];

    jsonFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          // leave as-is, Zod will catch invalid JSON
        }
      }
    });

    // boolean fix
    if (req.body.hasVariants !== undefined) {
      req.body.hasVariants =
        req.body.hasVariants === "true" || req.body.hasVariants === true;
    }

    if (req.body.isActive !== undefined) {
      req.body.isActive =
        req.body.isActive === "true" || req.body.isActive === true;
    }

    if (req.body.isFeatured !== undefined) {
      req.body.isFeatured =
        req.body.isFeatured === "true" || req.body.isFeatured === true;
    }
  }

  next();
};
