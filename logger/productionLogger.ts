import config from "config";
import { createLogger, format, transports } from "winston";
import path from "path";
import dbTansport from "./dbTransport";

const { combine, timestamp, json } = format;

const MONGODB_URI_LOG = config.get<string>("MONGODB_URI_LOG");

const productionLogger = function () {
  return createLogger({
    level: "error",
    format: combine(timestamp(), json()),

    transports: [
      new transports.Console(),
      new transports.File({
        filename: path.join(__dirname, "./logs/production/error.log"),
      }),
      new dbTansport(
        {
          level: "info",
          format: combine(timestamp(), json()),
        },
        { db: MONGODB_URI_LOG, collection: "msgbits" }
      ),
    ],
  });
};

export default productionLogger;
