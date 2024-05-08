class BaseError extends Error {
  readonly message: string;
  readonly name: string;
  readonly isOperational: boolean;
  readonly stack?: string;

  constructor(message: string, name: string, isOperational: boolean, err?: Error) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.name = name;
    this.isOperational = isOperational;
    if (err) {
      this.message = err.message;
      this.name = err.name;
      this.stack = err.stack;
    } else Error.captureStackTrace(this, this.constructor);
  }
}
function errToBaseError(err: Error, isOperational: boolean) {
  return new BaseError("", "", isOperational, err);
}

export { errToBaseError };
export default BaseError;
