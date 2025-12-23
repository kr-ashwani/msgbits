import express, { Router } from "express";
import path from "path";

const adminSocketUIRoute: Router = express.Router();

const socketUiPath = path.join(process.cwd(), "public/socketio-admin/dist");

// 1️⃣ Serve static assets
adminSocketUIRoute.use("/socketui", express.static(socketUiPath));

// 2️⃣ Serve index.html explicitly
adminSocketUIRoute.get("/socketui", (_req, res) => {
  res.sendFile(path.join(socketUiPath, "index.html"));
});

export default adminSocketUIRoute;
