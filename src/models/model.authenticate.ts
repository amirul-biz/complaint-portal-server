import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ILogin } from "../interfaces/interface.authenticate.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";

const prisma = new PrismaClient();

export async function modelAuthenticateLogin(data: ILogin) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "User email does not exist"
    );
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "Invalid email or password"
    );
  }

  const payload = { id: user.id, name: user.name, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return token;
}

export function modelAuthenticateRefreshToken(refreshToken: string) {
  if (!refreshToken) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.UNAUTHORIZED,
      "Refresh token required"
    );
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
    return { data: decoded };
  } catch (err: any) {
    const isTokenExpired = err.message === "jwt expired";
    const isTokenInvalid = err.message === "invalid signature";
    const invalidTokenMessage = "Invalid refresh token";

    switch (true) {
      case isTokenExpired: {
        const decoded = jwt.decode(refreshToken) as jwt.JwtPayload | null;
        if (!decoded) {
          throw new ApiErrorHelper(
            HttpStatusCodeEnum.FORBIDDEN,
            invalidTokenMessage
          );
        }

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
