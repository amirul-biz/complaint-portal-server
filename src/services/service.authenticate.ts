import bcrypt from "bcrypt";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ILogin } from "../interfaces/interface.authenticate.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";
import jwt from "jsonwebtoken";

export function validateIsLoginHaveValidationError(data: ILogin): void {
  if (!data.email || !data.password) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "Email and password is required"
    );
  }
}

export async function validateIsPasswordMatch(
  password: string,
  passwordHash: string
) {
  const isMatch = await bcrypt.compare(password, passwordHash);
  if (!isMatch) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "Invalid email or password"
    );
  }
}

export function validateIsTokenExist(token: string) {
  if (!token) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.UNAUTHORIZED,
      "Refresh token required"
    );
  }
}

export function getDecodedJwtInfo(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
  } catch (error) {
    throw new ApiErrorHelper(HttpStatusCodeEnum.FORBIDDEN, "Unauthorized");
  }
}
