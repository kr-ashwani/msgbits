import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { clientRes } from "../../utilityClasses/clientResponse";

const zodValidationErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const failureRes = clientRes.createErrorObj();
    failureRes.message = "Validation failed";
    failureRes.error = err.flatten((issue) => ({
      message: issue.message,
      errorCode: issue.code,
    }));
    clientRes.send(res, "Bad Request", failureRes);
    return;
  }
  next(err);
};

export default zodValidationErrorHandler;
