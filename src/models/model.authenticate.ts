import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ILogin } from "../interfaces/interface.authenticate.js";
import {
  validateIsLoginHaveValidationError,
  validateIsPasswordMatch,
  validateIsTokenExist,
} from "../services/service.authenticate.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

const prisma = new PrismaClient();

export async function modelAuthenticateLogin(data: ILogin) {
  validateIsLoginHaveValidationError(data);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "User email does not exist"
    );
  }

  await validateIsPasswordMatch(data.password, user.passwordHash);

  const payload = { id: user.id, name: user.name, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "5m",
  });

  return token;
}

export function modelGetNewJWTToken(currentJWTToken: string) {
  validateIsTokenExist(currentJWTToken);

  try {
    const decoded = jwt.verify(
      currentJWTToken,
      process.env.JWT_SECRET as string
    );
    return { data: decoded };
  } catch (err: any) {
    const isTokenExpired = err.message === "jwt expired";
    const isTokenInvalid = err.message === "invalid signature";
    const invalidTokenMessage = "Invalid refresh token";

    switch (true) {
      case isTokenExpired: {
        const decoded = jwt.verify(
          currentJWTToken,
          process.env.JWT_SECRET as string,
          { ignoreExpiration: true }
        ) as jwt.JwtPayload;
        return { data: decoded };
      }
      case isTokenInvalid: {
        throw new ApiErrorHelper(
          HttpStatusCodeEnum.FORBIDDEN,
          invalidTokenMessage
        );
      }
      default:
        throw new ApiErrorHelper(
          HttpStatusCodeEnum.FORBIDDEN,
          invalidTokenMessage
        );
    }
  }
}
