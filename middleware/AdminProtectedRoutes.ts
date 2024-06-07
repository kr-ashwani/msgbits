import { Request, Response, NextFunction } from "express";
import BaseError from "../errors/BaseError";
import { roleService } from "../service/role/roleService";
async function AdminProtectedRoutes(req: Request, res: Response, next: NextFunction) {
  if (req.authUser) {
    const response = await roleService.findAdminById({ userId: req.authUser._id });
    if (response.success) {
      if (response.data.userRole.role === "admin") return next();
      throw new BaseError(
        `user with email ${req.authUser.email} donot have Admin Privilege`,
        "AdminAurthorizationError"
      );
    } else throw new BaseError(response.message, "AdminAurthorizationError");
  }

  throw new BaseError(
    "Admin Authorization failed because user is not registered",
    "AdminAurthorizationError"
  );
}

export default AdminProtectedRoutes;
