import { Express } from "express";
import authRouter from "./authRoutes/authRoutes";

function routes(app: Express) {
  app.use(authRouter);
}

export default routes;
