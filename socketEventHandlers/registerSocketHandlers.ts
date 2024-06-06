import { Socket, Server } from "socket.io";
import logger from "../logger";

// Entry point for socket io handlers
function registerSocketHandlers(socket: Socket, io: Server) {
  logger.info(
    `${socket.data.auth.name}-${socket.data.auth.email} connected with socketid - ${socket.id}`
  );
}

export default registerSocketHandlers;
