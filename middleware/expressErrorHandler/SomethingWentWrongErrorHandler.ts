import { Request, Response, NextFunction } from "express";
import handleError from "../../errorhandler/ErrorHandler";
import { errToBaseError } from "../../errors/BaseError";

const SomethingWentWrongErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.writableFinished) res.status(500).json({ message: "Something went wrong" });
  handleError(errToBaseError(err, false));
};

export default SomethingWentWrongErrorHandler;
