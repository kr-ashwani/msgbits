import express, { Router } from "express";
import logoutController from "../../controllers/auth/logoutController";
import asyncWrapper from "../../middleware/asyncWrapper";
import authTokenVerifyController from "../../controllers/auth/authTokenVerifyController";
import getAccessTokenController from "../../controllers/auth/getAccessTokenController";

const protectedAuthRouter: Router = express.Router();

protectedAuthRouter.route("/authtokenverify").get(authTokenVerifyController);

protectedAuthRouter.route("/getaccesstoken").get(asyncWrapper(getAccessTokenController));

protectedAuthRouter.route("/logout").get(asyncWrapper(logoutController));

export default protectedAuthRouter;
