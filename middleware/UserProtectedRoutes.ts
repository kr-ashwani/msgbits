import { Request, Response, NextFunction } from "express";
import BaseError from "../errors/BaseError";
function UserProtectedRoutes(req: Request, res: Response, next: NextFunction) {
  if (req.authUser) next();
  throw new BaseError("User Authorization failed", "UserAurthorizationError");
}

export default UserProtectedRoutes;
