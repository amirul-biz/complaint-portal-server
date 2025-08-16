import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { IAuthTokens, ILogin } from "../interfaces/interface.authenticate.js";
import {
  validateIsLoginHaveValidationError,
  validateIsPasswordMatch,
  validateIsTokenExist,
} from "../services/service.authenticate.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

const prisma = new PrismaClient();

export async function modelAuthenticateLogin(
  data: ILogin
): Promise<IAuthTokens> {
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
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export function modelGetNewJWTToken(refreshToken: string) {
  validateIsTokenExist(refreshToken);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const payload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "5m",
    });

    return { accessToken, refreshToken };
  } catch (err: any) {
    const isTokenExpired = err.message === "jwt expired";
    const isTokenInvalid = err.message === "invalid signature";
    const invalidTokenMessage = "Invalid refresh token";

    switch (true) {
      case isTokenExpired: {
        throw new ApiErrorHelper(
          HttpStatusCodeEnum.UNAUTHORIZED,
          "Refresh token expired. Please login again."
        );
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
