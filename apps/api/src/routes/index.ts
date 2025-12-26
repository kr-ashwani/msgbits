import type { Express } from "express";
import AdminProtectedRoutes from "../middleware/AdminProtectedRoutes";
import authRouter from "./authRoutes/authRoute";
import heartbeatRouter from "./heartbeatRoutes/heatbeatRoute";
import adminSocketUIRoute from "./adminSocketUIRoutes/adminSocketUIRoute";
import OAuthRouter from "./authRoutes/OAuthRoutes";
import fileRouter from "./filesRoutes/fileRoutes";
import webrtcRouter from "./webrtcRoutes/webrtcRoutes";
import protectedRoutes from "../middleware/protectedRoutes";
import protectedAuthRouter from "./authRoutes/protectedAuthRoute";

function routes(app: Express) {
  // public routes
  app.use(heartbeatRouter);
  app.use(authRouter);
  app.use("/oauth", OAuthRouter);

  // protected routes
  app.use(protectedRoutes); // middleware to protect routes

  app.use(protectedAuthRouter);
  app.use(fileRouter);
  app.use(webrtcRouter);

  // admin protected routes
  app.use("/admin", AdminProtectedRoutes, adminSocketUIRoute);
}

export default routes;
