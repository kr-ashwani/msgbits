import config from "config";
import mongoose from "mongoose";
import logger from "../logger";
import { errToAppError } from "../errors/AppError";
import handleError from "../errors/errorhandler/ErrorHandler";
import { syncAllIndexes } from "../config/syncIndexes";

const MONGODB_URI = config.get<string>("MONGODB_URI");
const NODE_ENV = config.get<string>("NODE_ENV");

export default async function dbConnection() {
  try {
    mongoose.set("autoIndex", NODE_ENV !== "production");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error: " + err);
    });
    await mongoose.connect(MONGODB_URI);

    if (NODE_ENV === "production") await syncAllIndexes();
    logger.info("Connected to MongoDB");
  } catch (err) {
    if (err instanceof Error) handleError(errToAppError(err, true));
  }
}
