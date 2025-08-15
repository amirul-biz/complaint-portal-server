import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";
import { Request, Response, NextFunction } from "express";

export function middlewareApiErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiErrorHelper) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: err.message,
    });
  }

  return res
    .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
}
