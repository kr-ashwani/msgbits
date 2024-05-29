import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

/**
 * validates schema for incomming request
 * @param schema AnyZodObject
 * @returns void
 */
const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };

export default validateResource;
