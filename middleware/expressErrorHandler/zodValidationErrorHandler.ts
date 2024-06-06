import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ClientResponse } from "../../utilityClasses/clientResponse";

const zodValidationErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const clientRes = new ClientResponse();

    const failureRes = clientRes.createErrorObj(
      "Validation failed",
      err.flatten((issue) => ({
        message: issue.message,
        errorCode: issue.code,
      }))
    );

    clientRes.send(res, "Bad Request", failureRes);
    return;
  }
  next(err);
};

export default zodValidationErrorHandler;
