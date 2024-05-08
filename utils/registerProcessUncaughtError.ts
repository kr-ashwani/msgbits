import handleError from "../errorhandler/ErrorHandler";
import { errToBaseError } from "../errors/BaseError";

process.on("uncaughtException", (err) => {
  if (err instanceof Error) handleError(errToBaseError(err, false));
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  if (err instanceof Error) handleError(errToBaseError(err, false));
  process.exit(1);
});
