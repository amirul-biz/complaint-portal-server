import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

export const middlewareJwtAuthenticator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.FORBIDDEN,
      "Access denied. No token provided"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.FORBIDDEN,
      "Access denied. Invalid token format"
    );
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
    if (!err) {
      next();
      return;
    }

    const isTokenExpired = err.message === "jwt expired";
    const isTokenInvalid = err.message === "invalid signature";
    if (isTokenExpired) {
      const error = new ApiErrorHelper(
        HttpStatusCodeEnum.UNAUTHORIZED,
        `Access denied. Token expired`
      );
      return next(error);
    }

    if (isTokenInvalid) {
      const error = new ApiErrorHelper(
        HttpStatusCodeEnum.FORBIDDEN,
        "Invalid token"
      );
      return next(error);
    }
  });
};
