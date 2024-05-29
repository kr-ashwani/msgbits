import { Request, Response } from "express";
import { createUser } from "../../service/user/userService";

async function signupController(req: Request, res: Response) {
  const user = await createUser(req.body);
  res.status(200).json(user);
}

export default signupController;
