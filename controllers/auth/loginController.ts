import { Request, Response } from "express";

import { ClientResponse } from "../../utilityClasses/clientResponse";
import { userService } from "../../service/user/userService";

async function loginController(req: Request, res: Response) {
  const resObj = await userService.findAndValidateUser(req.body);
  const clientRes = new ClientResponse();
  if (resObj.success) {
    clientRes.sendJWTToken(res, resObj.data);
    clientRes.send(res, "OK", resObj);
  } else clientRes.send(res, "Bad Request", resObj);
}

export default loginController;
