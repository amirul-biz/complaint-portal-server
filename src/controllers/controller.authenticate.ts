import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import {
  modelAuthenticateLogin,
  modelGetNewJWTToken,
} from "../models/model.authenticate.js";
import { ILogin } from "../interfaces/interface.authenticate.js";

export async function controllerLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body as ILogin;

    const token = await modelAuthenticateLogin({ email, password });
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export const controllerGetNewJWTToken = (req: Request, res: Response) => {
  const { currentJWTToken } = req.body;

  const response = modelGetNewJWTToken(currentJWTToken);

  const user = response.data as jwt.JwtPayload;

  const payload = { id: user.id, name: user.name, email: user.email };

  const newJwtToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "5m",
  });

  return res.json(newJwtToken);
};
