import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { clientRes } from "../../utilityClasses/clientResponse";

const zodValidationErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    clientRes.send(
      res,
      "Bad Request",
      "Validation failed",
      err.flatten((issue) => ({
        message: issue.message,
        errorCode: issue.code,
      }))
    );
    return;
  }
  next(err);
};

export default zodValidationErrorHandler;
