import winston from "winston";
import devLogger from "./devLogger";
import productionLogger from "./productionLogger";

let logger: winston.Logger | null = null;

if (process.env.NODE_ENV === "production") {
  logger = productionLogger();
} else if (process.env.NODE_ENV === "development") {
  logger = devLogger();
} else {
  logger = devLogger();
}

export default logger!;
