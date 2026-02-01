import type { NextFunction, Request, Response } from "express";

export const checkValidData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
};
