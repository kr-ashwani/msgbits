import { Request, Response } from "express";
import { clientRes } from "../../utilityClasses/clientResponse";

async function logoutController(req: Request, res: Response) {
  // clear auth cookie
  clientRes.clearAuthJWTToken(res);
  const successRes = clientRes.createSuccessObj();
  successRes.message = "User logged out successfully";
  successRes.data = successRes.message;
  clientRes.send(res, "OK", successRes);
}

export default logoutController;
