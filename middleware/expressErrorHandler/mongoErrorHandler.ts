import { Request, Response, NextFunction } from "express";
import { clientRes } from "../../utilityClasses/clientResponse";
import mongoose from "mongoose";

const mongoErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.MongooseError) {
    const failureRes = clientRes.createErrorObj();
    if (
      err instanceof mongoose.Error.ValidationError ||
      err instanceof mongoose.Error.ValidatorError
    )
      failureRes.message = "database validation failed";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      failureRes.message = "database document not found";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      failureRes.message = "database document not found";
    else failureRes.message = "database error";

    failureRes.error = failureRes.message;
    clientRes.send(res, "Bad Request", failureRes);
    return;
  }
  next(err);
};

export default mongoErrorHandler;
