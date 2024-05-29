import { Express } from "express";
import mongoErrorHandler from "./expressErrorHandler/mongoErrorHandler";
import zodValidationErrorHandler from "./expressErrorHandler/zodValidationErrorHandler";
import SomethingWentWrongErrorHandler from "./expressErrorHandler/SomethingWentWrongErrorHandler";

function registerErrorHandler(app: Express) {
  app.use(zodValidationErrorHandler);
  app.use(mongoErrorHandler);
  app.use(SomethingWentWrongErrorHandler);
}

export default registerErrorHandler;
