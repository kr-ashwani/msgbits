import { ExtendedError } from "socket.io/dist/namespace";

class SocketAuthError extends Error implements ExtendedError {
  data?: any;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

export default SocketAuthError;
