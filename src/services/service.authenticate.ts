import bcrypt from "bcrypt";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ILogin } from "../interfaces/interface.authenticate.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

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
