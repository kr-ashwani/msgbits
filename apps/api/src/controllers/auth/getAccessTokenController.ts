import { Request, Response } from "express";
import { ClientResponse } from "../../utils/clientResponse";
import { authService } from "../../service/database/auth/authService";

async function getAccessTokenController(req: Request, res: Response) {
  const token = authService.createAccessToken(req.authUser as any);
  const clientRes = new ClientResponse(res);
  clientRes.send("OK", clientRes.createSuccessObj("Access token created successfully.", token));
}

export default getAccessTokenController;
