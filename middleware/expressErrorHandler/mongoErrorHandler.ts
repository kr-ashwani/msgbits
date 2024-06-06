import { Request, Response, NextFunction } from "express";
import { ClientResponse } from "../../utilityClasses/clientResponse";
import mongoose from "mongoose";

const mongoErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.MongooseError) {
    const clientRes = new ClientResponse();

    let message = "";
    if (
      err instanceof mongoose.Error.ValidationError ||
      err instanceof mongoose.Error.ValidatorError
    )
      message = "database validation failed";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      message = "database document not found";
    else if (err instanceof mongoose.Error.DocumentNotFoundError)
      message = "database document not found";
    else message = "database error";

    clientRes.send(res, "Bad Request", clientRes.createErrorObj(message, err.message));
    return;
  }
  next(err);
};

export default mongoErrorHandler;
