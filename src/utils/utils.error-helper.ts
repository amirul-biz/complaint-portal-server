export class ApiErrorHelper extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype chain
    Error.captureStackTrace(this, this.constructor);
  }
}
