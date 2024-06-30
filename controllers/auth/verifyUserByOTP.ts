import { Request, Response } from "express";
import { ClientResponse } from "../../utilityClasses/clientResponse";
import { verifyOTPService } from "../../service/user/verifyOTPService";
import { resSchemaForModel } from "../../utilityClasses/ResponseSchemaForModel";

async function verifyUserByOTPController(req: Request, res: Response) {
  const resObj = await verifyOTPService(req.body);
  const clientRes = new ClientResponse();
  if (resObj.success) {
    clientRes.sendJWTToken(res, resSchemaForModel.getUser(resObj.data));
    clientRes.send(res, "OK", resObj);
  } else clientRes.send(res, "Bad Request", resObj);
}

export default verifyUserByOTPController;
