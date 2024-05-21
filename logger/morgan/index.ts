import morgan from "morgan";
import logger from "..";

const stream = {
  // Use the http severity
  write: (message: string) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ":pid :remote-addr - :remote-user [:date] :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent",
  { stream }
);
morgan.token("pid", function getId(req) {
  return process.pid.toString();
});

export default morganMiddleware;
