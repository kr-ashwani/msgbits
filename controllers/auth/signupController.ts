import { Request, Response } from "express";
import { createUser } from "../../service/user/userService";
import { clientRes } from "../../utilityClasses/clientResponse";

async function signupController(req: Request, res: Response) {
  const user = await createUser(req.body);
  const successRes = clientRes.createSuccessObj();
  successRes.message =
    "User successfully created. Enter the OTP sent to your registered Email to verify account.";
  successRes.data = user;
  clientRes.send(res, "OK", successRes);
}

export default signupController;
