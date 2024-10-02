import fileUploadController from "../../controllers/files/fileUploadController";
import asyncWrapper from "../../middleware/asyncWrapper";

const express = require("express");

const fileRouter = express.Router();

fileRouter.route("/upload/:fileId").post(asyncWrapper(fileUploadController));

export default fileRouter;
