import "dotenv/config.js";
import "./utils/registerProcessUncaughtError";
import express, { Express } from "express";
import config from "config";
import dbConnection from "./utils/dbConnection";
import logger from "./logger";
import registerErrorHandler from "./middleware/registerErrorHandler";
import morganMiddleware from "./logger/morgan";
import routes from "./routes";
import swaggerDocs from "./utils/swagger";
import "./service/MailService";
import RedisPubSub from "./redis";

class App {
  private readonly app: Express;
  private readonly PORT = config.get<number>("PORT");

  constructor() {
    this.app = express();
  }
  private init() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandlerMidleware();
  }
  //All middlewares except Error Handler middleware
  private initializeMiddlewares() {
    this.app.use(morganMiddleware);
    this.app.use(express.json());
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
    logger.info(`Worker process ${process.pid} is running at http://localhost:${this.PORT}`);
    dbConnection();
    RedisPubSub.getInstance();

    swaggerDocs(this.app, this.PORT);
  }

  // public methods called by outer world
  public run() {
    this.init();
    this.app.listen(this.PORT, this.appHandler.bind(this));
  }
}

export default App;
