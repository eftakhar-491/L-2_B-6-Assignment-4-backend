import type { NextFunction, Request, Response } from "express";

import { envVars } from "../config/env";
import AppError from "../helper/AppError";
import type { TErrorSources } from "../@types/error.types";
import { Prisma } from "../../../generated/prisma/client";

// import { handleCastError } from "../helpers/handleCastError";
// import { handlerDuplicateError } from "../helpers/handleDuplicateError";
// import { handlerValidationError } from "../helpers/handlerValidationError";
// import { handlerZodError } from "../helpers/handlerZodError";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("============================================");
    console.log(err);
    console.log("============================================");
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        const target = (err.meta?.target as string[])?.join(", ");
        message = target
          ? `Duplicate value for: ${target}`
          : "Duplicate value error";
        break;
      }
      case "P2003": {
        statusCode = 409;
        message = "Foreign key constraint failed";
        break;
      }
      case "P2025": {
        statusCode = 404;
        message = "Record not found";
        break;
      }
      case "P2000": {
        statusCode = 400;
        message = "Value too long for column";
        break;
      }
      case "P2011": {
        statusCode = 400;
        message = "Null constraint violation";
        break;
      }
      case "P2014": {
        statusCode = 409;
        message = "Relation violation";
        break;
      }
      default: {
        statusCode = 400;
        message = err.message;
      }
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid request data";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection error";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Database engine panic";
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation error";
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
