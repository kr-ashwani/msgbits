import { Request, Response } from "express";
import { userService } from "../../service/user/userService";
import { ClientResponse } from "../../utilityClasses/clientResponse";

export const forgotPasswordController = async (req: Request, res: Response) => {
  const resObj = await userService.forgotPassword(req.body);
  const clientRes = new ClientResponse();

  if (resObj.success) {
    clientRes.send(res, "OK", resObj);
  } else clientRes.send(res, "Bad Request", resObj);
};
