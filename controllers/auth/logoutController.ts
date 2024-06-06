import { Request, Response } from "express";
import { ClientResponse } from "../../utilityClasses/clientResponse";

async function logoutController(req: Request, res: Response) {
  // clear auth cookie
  const clientRes = new ClientResponse();
  clientRes.clearAuthJWTToken(res);
  const successRes = clientRes.createSuccessObj(
    "User logged out successfully",
    "User logged out successfully"
  );

  successRes.data = successRes.message;
  clientRes.send(res, "OK", successRes);
}

export default logoutController;
