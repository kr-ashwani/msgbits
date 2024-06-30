import { Request, Response } from "express";
import { userService } from "../../service/user/userService";
import { ClientResponse } from "../../utilityClasses/clientResponse";

export const resetPasswordController = async (req: Request, res: Response) => {
  const resObj = await userService.resetPassword(req.body);
  const clientRes = new ClientResponse();

  if (resObj.success) {
    clientRes.send(res, "OK", resObj);
  } else clientRes.send(res, "Bad Request", resObj);
};
