import { Request, Response } from "express";
import { createUser } from "../../service/user/userService";
import { clientRes } from "../../utilityClasses/clientResponse";

async function signupController(req: Request, res: Response) {
  const user = await createUser(req.body);
  clientRes.send(
    res,
    "OK",
    "User successfully created. Enter the OTP sent to your registered Email to verify account.",
    user
  );
}

export default signupController;
