import { Request, Response, NextFunction } from "express";
import { clientRes } from "../../utilityClasses/clientResponse";
import mongoose from "mongoose";
import { MongoError, MongoServerError } from "mongodb";

const mongoErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.MongooseError) {
    console.log("yoo");
    let errMsg = "";
    if (
      err instanceof mongoose.Error.ValidationError ||
      err instanceof mongoose.Error.ValidatorError
    )
      errMsg = "database validation failed";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      errMsg = "database document not found";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      errMsg = "database document not found";
    else errMsg = "database error";

    clientRes.send(res, "Bad Request", "database validation failed", err.message);
    return;
  }
  next(err);
};

export default mongoErrorHandler;
