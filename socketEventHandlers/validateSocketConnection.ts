import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import cookie from "cookie";
import BaseError, { errToBaseError } from "../errors/BaseError";
import handleError from "../errorhandler/ErrorHandler";
import { validateAuthTokenService } from "../service/user/validateAuthTokenService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface SocketAuthData {
  auth: {
    id: string;
    email: string;
    name: string;
    isVerified: boolean;
    createdAt: Date;
  };
}

export async function validateSocketConnection(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketAuthData>,
  next: (err?: ExtendedError) => void
) {
  // console.log(socket.conn.request);
  try {
    const authCookie = cookie.parse(socket.handshake.headers.cookie || "");

    const response = await validateAuthTokenService(authCookie);
    if (response.success) {
      // set auth detail to socket
      socket.data.auth = {
        id: response.data.originalUser._id.toString(),
        name: response.data.originalUser.name,
        email: response.data.originalUser.email,
        isVerified: response.data.originalUser.isVerified,
        createdAt: response.data.originalUser.createdAt,
      };
      return next();
    }

    throw new BaseError(
      `Unable to establish socket connection for socketid - ${socket.id} because ${response.error}`,
      "Authorization failed Error"
    );
  } catch (err: any) {
    if (err instanceof BaseError) handleError(err);
    else if (err instanceof Error) handleError(errToBaseError(err));
    next(err);
  }
}
