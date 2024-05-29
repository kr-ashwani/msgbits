import type { Server, Socket } from "socket.io";
import logger from "../logger";

// Entry point for socket io handlers
function registerSocketHandlers(socket: Socket, io: Server) {
  logger.info(`New User connected with id - ${socket.id}`);
}

export default registerSocketHandlers;
