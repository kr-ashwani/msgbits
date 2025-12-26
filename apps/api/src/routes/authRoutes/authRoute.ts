import express, { Router } from "express";
import signupController from "../../controllers/auth/signupController";
import asyncWrapper from "../../middleware/asyncWrapper";
import validateResource from "../../middleware/validateResource";
import { createUserSchema } from "../../schema/user/userSchema";
import loginController from "../../controllers/auth/loginController";
import { validateUserSchema } from "../../schema/user/validateUserSchema";
import verifyUserByOTPController from "../../controllers/auth/verifyUserByOTPController";
import { createOTPSchema } from "../../schema/user/OTPSchema";
import { forgotPasswordController } from "../../controllers/auth/forgotPasswordController";
import { resetPasswordController } from "../../controllers/auth/resetPasswordController";
import { forgotPasswordSchema } from "../../schema/user/forgotPasswordSchema";
import { resetPasswordSchema } from "../../schema/user/resetPasswordSchema";

const authRouter: Router = express.Router();

authRouter
  .route("/signup")
  .post(validateResource(createUserSchema), asyncWrapper(signupController));

authRouter
  .route("/login")
  .post(validateResource(validateUserSchema), asyncWrapper(loginController));

authRouter
  .route("/verifyaccount")
  .post(validateResource(createOTPSchema), asyncWrapper(verifyUserByOTPController));

authRouter
  .route("/forgotpassword")
  .post(validateResource(forgotPasswordSchema), asyncWrapper(forgotPasswordController));

authRouter
  .route("/resetpassword")
  .post(validateResource(resetPasswordSchema), asyncWrapper(resetPasswordController));

export default authRouter;
