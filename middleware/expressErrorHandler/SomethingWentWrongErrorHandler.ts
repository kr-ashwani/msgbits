import { Request, Response, NextFunction } from "express";
import handleError from "../../errorhandler/ErrorHandler";
import { errToBaseError } from "../../errors/BaseError";
import { clientRes } from "../../utilityClasses/clientResponse";

const SomethingWentWrongErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const failureRes = clientRes.createErrorObj();
  failureRes.message = "Something went wrong";
  failureRes.error = err.message;
  if (!res.writableFinished) clientRes.send(res, "Internal Server Error", failureRes);

  handleError(errToBaseError(err, false));
};

export default SomethingWentWrongErrorHandler;
