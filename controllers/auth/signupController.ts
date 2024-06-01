import { Request, Response } from "express";
import { createUser } from "../../service/user/userService";
import { clientRes } from "../../utilityClasses/clientResponse";

async function signupController(req: Request, res: Response) {
  const user = await createUser(req.body);
  clientRes.send(res, "OK", "User successfully created", user);
}

export default signupController;
