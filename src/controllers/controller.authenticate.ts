import { NextFunction, Request, Response } from "express";

import { ILogin } from "../interfaces/interface.authenticate.js";
import {
  modelAuthenticateLogin,
  modelGetNewJWTToken,
} from "../models/model.authenticate.js";

export async function controllerLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as ILogin;

    const { accessToken, refreshToken } = await modelAuthenticateLogin({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export const controllerGetNewJWTToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  const response = modelGetNewJWTToken(refreshToken);

  res.cookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json(response.accessToken);
};
