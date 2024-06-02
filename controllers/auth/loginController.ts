import { Request, Response } from "express";
import { findAndValidateUser } from "../../service/user/userService";
import { clientRes } from "../../utilityClasses/clientResponse";

async function loginController(req: Request, res: Response) {
  const resObj = await findAndValidateUser(req.body);
  if (resObj.success) {
    clientRes.sendJWTToken(res, resObj.data);
    clientRes.send(res, "OK", resObj);
  } else clientRes.send(res, "Bad Request", resObj);
}

export default loginController;
