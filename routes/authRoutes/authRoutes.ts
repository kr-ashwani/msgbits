import signupController from "../../controllers/auth/signupController";
import asyncWrapper from "../../middleware/asyncWrapper";
import validateResource from "../../middleware/validateResource";
import { createUserSchema } from "../../schema/user/userSchema";

const express = require("express");

const authRouter = express.Router();

authRouter
  .route("/signup")
  .post(validateResource(createUserSchema), asyncWrapper(signupController));

export default authRouter;
