import "dotenv/config.js";
import "./utils/registerProcessUncaughtError";
import path from "path";
import cookieParser from "cookie-parser";
import http from "node:http";
import express from "express";
import config from "config";
import dbConnection from "./utils/dbConnection";
import logger from "./logger";
import registerErrorHandler from "./middleware/registerErrorHandler";
import morganMiddleware from "./logger/morgan";
import routes from "./routes";
import swaggerDocs from "./utils/swagger";
import "./service/mail/mailService";
import RedisPubSub from "./redis";
import cluster from "cluster";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import RedisConnection from "./redis/redisConnection";
import registerSocketHandlers from "./socketEventHandlers/registerSocketHandlers";
import { instrument } from "@socket.io/admin-ui";
import os from "os";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import {
  SocketAuthData,
  validateSocketConnection,
} from "./socketEventHandlers/validateSocketConnection";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./model/role.model";

class App {
  private readonly app;
  private readonly server;
  static readonly PORT = config.get<number>("PORT");

  private static readonly redisConfig = {
    port: config.get<number>("REDIS_PORT"),
    host: config.get<string>("REDIS_HOST"),
    lazyConnect: true,
  };
  private static readonly socketUIConfig = {
    username: config.get<string>("SOCKETUI_USERNAME"),
    password: config.get<string>("SOCKETUI_PASSWORD"),
  };
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    //initialize Express App like redis adapter, middlewares, routes and error handler
    this.init();
  }
  private init() {
    this.initializeRedisAdapter();
    this.initializeMiddlewares();
    this.initializeRoutes();

    //initialize error handler at End
    this.initializeErrorHandlerMidleware();
  }
  //Socket io Redis Adapter
  private initializeRedisAdapter() {
    const redisClient = new RedisConnection(App.redisConfig, `Redis Adapter`).getConnection();

    const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketAuthData>({
      adapter: createAdapter(redisClient),
      cors: {
        credentials: true,
      },
    });
    io.listen(this.server);
    io.use(validateSocketConnection);
    io.on("connection", (socket) => {
      registerSocketHandlers(socket, io);
    });
    // Socket io Admin UI
    instrument(io, {
      serverId: `${os.hostname()}#${process.pid}`,
      auth: {
        type: "basic",
        username: App.socketUIConfig.username,
        password: App.socketUIConfig.password,
      },
    });
    setupWorker(io);
    this.initializeSocketIOadminUI();
  }
  private initializeSocketIOadminUI() {
    this.app.use("/admin/socketui", express.static(path.join(__dirname, "./views/socketio/dist")));
  }
  //All middlewares except Error Handler middleware
  private initializeMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morganMiddleware);
  }
  //Routes of the app
  private initializeRoutes() {
    routes(this.app);
  }
  // Error Handler middleware must be used at the end
  private initializeErrorHandlerMidleware() {
    registerErrorHandler(this.app);
  }

  // app handler will be called by public function run when express
  // app will bind port number
  private appHandler() {
    if (cluster.isPrimary)
      logger.info(`Server with pid ${process.pid} is running at http://localhost:${App.PORT}`);
    else
      logger.info(
        `Server Worker process with pid ${process.pid} is running at http://localhost:${App.PORT}`
      );
    dbConnection();
    RedisPubSub.getInstance();

    swaggerDocs(this.app, App.PORT);
  }

  // public method to start Express App
  public run() {
    //this.server.listen(this.PORT, this.appHandler.bind(this));
    this.appHandler();
  }
  // used by master process to start App on given port and initialize SocketIO stickySession
  static startServerAndinitializeSocketIOstickySession() {
    const httpServer = http.createServer();
    //socket io sticky session master setup
    setupMaster(httpServer, {
      loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
    });
    httpServer.listen(App.PORT);
  }
}

export default App;
