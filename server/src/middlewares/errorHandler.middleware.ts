import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/config";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};
