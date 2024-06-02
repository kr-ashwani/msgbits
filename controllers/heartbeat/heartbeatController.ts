import { Request, Response } from "express";
import { clientRes } from "../../utilityClasses/clientResponse";

async function heartbeatController(req: Request, res: Response) {
  const successRes = clientRes.createSuccessObj();
  successRes.message = "ping is successful";
  successRes.data = {
    status: "server is alive 👻",
  };
  clientRes.send(res, "OK", successRes);
}

export default heartbeatController;
