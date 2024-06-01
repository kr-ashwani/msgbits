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
  if (!res.writableFinished)
    clientRes.send(res, "Internal Server Error", "Something went wrong", err.message);

  handleError(errToBaseError(err, false));
};

export default SomethingWentWrongErrorHandler;
