import express, { Router } from "express";
import webrtcTurnController from "../../controllers/webrtc/webrtcStunTurnController";
import asyncWrapper from "../../middleware/asyncWrapper";

const webrtcRouter: Router = express.Router();

webrtcRouter.route("/stunturncredentials").get(asyncWrapper(webrtcTurnController));

export default webrtcRouter;
