import { Server } from "socket.io";
import logger from "../../logger";
import { EmitterMapping, ListenerSchema } from "./types";
import { SocketManager } from "./SocketManager";
import handleError from "../../errorhandler/ErrorHandler";
import { AppError, errToAppError } from "../../errors/AppError";

export class IOManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public emit<K extends keyof EmitterMapping>(
    event: K,
    data: EmitterMapping[K],
    callback?: (err: any, ack: { success: boolean }) => void
  ) {
    this.io.emit(event, data, callback);
  }

  public on<K extends keyof ListenerSchema>(
    event: K,
    callback: (payload: Zod.infer<ListenerSchema[K]>) => Promise<void>
  ) {
    const eventHandler = async (payload: any, ack: any) => {
      const result = ListenerSchema[event].safeParse(payload);

      if (result.success) {
        // wait for the callback to execute
        try {
          await callback(result.data);
          if (typeof ack === "function") ack();
        } catch (err) {
          if (err instanceof Error) handleError(errToAppError(err));
          else handleError(new AppError("Failure in socket listener"));
          if (typeof ack === "function") ack({ success: false, error: "Something went wrong" });
        }
      } else {
        const error = `ValidationError: client did not correctly send ${event} event data`;
        if (typeof ack === "function") ack({ success: false, error });
        handleError(new AppError(error));
      }
    };
    this.io.on(event as string, eventHandler);
    return { event, eventHandler };
  }

  public off<K extends keyof ListenerSchema>(
    event: K,
    callback?: (payload: Zod.infer<ListenerSchema[K]>) => void
  ): void {
    if (callback) {
      this.io.off(event as string, callback);
    } else {
      this.io.removeAllListeners(event as string);
    }
  }

  public timeout(timeout: number) {
    this.io.timeout(timeout);
    return this;
  }

  public once<K extends keyof ListenerSchema>(
    event: K,
    callback: (payload: Zod.infer<ListenerSchema[K]>) => void
  ) {
    const eventHandler = (payload: any, ack: any) => {
      const result = ListenerSchema[event].safeParse(payload);
      if (result.success) callback(result.data);
      else {
        const error = `ValidationError: client did not correctly send ${event} event data`;
        ack({ success: false, error });
        logger.error(error);
      }
    };
    this.io.once(event as string, callback);
    return { event, eventHandler };
  }

  public removeAllListeners(event?: string): void {
    if (event) {
      this.io.removeAllListeners(event);
    } else {
      this.io.removeAllListeners();
    }
  }

  public send(data: any, callback?: (error: any) => void): void {
    this.io.send(data, callback);
  }

  public ioInst(): Server {
    return this.io;
  }
  public in(room: string | string[]) {
    return this.io.in(room);
  }
  public to(room: string | string[]) {
    return new SocketManager(this.io.to(room) as any);
  }
}
