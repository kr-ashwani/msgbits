import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import App from "./server";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Master process with pid ${process.pid} is running`);

  //start server and initialize SocketIO stickySession
  App.startServerAndinitializeSocketIOstickySession();

  for (let i = 0; i < (numCPUs >= 2 ? 2 : 1); i++) {
    // spawn worker cluster
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker process with pid ${worker.process.pid} died with code ${code}. Restarting...`
    );
    cluster.fork();
  });
} else {
  // Instantiate App and run it
  const app = new App();
  app.run();
}
