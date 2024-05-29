import http from "node:http";
import "dotenv/config.js";
import "./utils/registerProcessUncaughtError";
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

class App {
  private readonly app;
  private readonly server;
  private readonly PORT = config.get<number>("PORT");

  private static readonly redisConfig = {
    port: config.get<number>("REDIS_PORT"),
    host: config.get<string>("REDIS_HOST"),
    lazyConnect: true,
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

    const io = new Server({
      adapter: createAdapter(redisClient),
    });
    io.listen(this.server);
    io.on("connection", (socket) => {
      registerSocketHandlers(socket, io);
    });
  }
  //All middlewares except Error Handler middleware
  private initializeMiddlewares() {
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
      logger.info(`Server with pid ${process.pid} is running at http://localhost:${this.PORT}`);
    else
      logger.info(
        `Server Worker process with pid ${process.pid} is running at http://localhost:${this.PORT}`
      );
    dbConnection();
    RedisPubSub.getInstance();

    swaggerDocs(this.app, this.PORT);
  }

  // public method to start Express App
  public run() {
    this.server.listen(this.PORT, this.appHandler.bind(this));
  }
}

export default App;
