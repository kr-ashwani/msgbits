import { Socket, Server, Namespace } from "socket.io";
import logger from "../logger";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketAuthData } from "./validateSocketConnection";

// Entry point for socket io handlers
function registerSocketHandlers(socket: Socket, io: Server) {
  logger.info(
    `${socket.data.auth.name}-${socket.data.auth.email} connected with socketid - ${socket.id}`
  );
}
function registerAdminSocketHandlers(
  socket: Socket,
  namespace: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketAuthData>
) {
  logger.info(
    `Admin ${socket.data.auth.name}-${socket.data.auth.email} connected with socketid - ${socket.id}`
  );
}
export { registerSocketHandlers, registerAdminSocketHandlers };
