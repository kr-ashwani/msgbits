import { Request, Response, NextFunction } from "express";
import AuthenticationError from "../errors/httperror/AuthenticationError";

function protectedRoutes(req: Request, _res: Response, next: NextFunction) {
  if (req.authUser) return next();
  throw new AuthenticationError("Authentication Error: Auth Token is missing");
}

export default protectedRoutes;
