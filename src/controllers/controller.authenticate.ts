import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import {
  modelAuthenticateLogin,
  modelAuthenticateRefreshToken,
} from "../models/model.authenticate.js";
import { ILogin } from "../interfaces/interface.authenticate.js";

export async function controllerLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as ILogin;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const token = await modelAuthenticateLogin({ email, password });
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export const modelRefreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const response = modelAuthenticateRefreshToken(refreshToken);

  const decodedPayload = response.data as jwt.JwtPayload;

  const newJwtToken = jwt.sign(
    { username: decodedPayload.username },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "5m",
    }
  );

  return res.json(newJwtToken);
};
