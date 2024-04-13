import config from "config";
import { createLogger, format, transports } from "winston";
import path from "path";
import dbTansport from "./dbTransport";

const { combine, timestamp, label, printf, json } = format;

const MONGODB_URI_LOG = config.get<string>("MONGODB_URI_LOG");
const devLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  return createLogger({
    level: "info",
    format: combine(format.colorize(), timestamp({ format: "HH:mm:ss" }), myFormat),

    transports: [
      new transports.Console(),
      new transports.File({
        filename: path.join(__dirname, "./logs/development/error.log"),
        level: "error",
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

export default devLogger;
