import express, { Router } from "express";
import heartbeatController from "../../controllers/heartbeat/heartbeatController";
const heartbeatRouter: Router = express.Router();

heartbeatRouter.route("/heartbeat").get(heartbeatController);

export default heartbeatRouter;
