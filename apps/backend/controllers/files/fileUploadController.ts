import { Request, Response } from "express";

import { fileStreamingService } from "../../service/file/fileStreamingService";

async function fileUploadController(req: Request, res: Response) {
  await fileStreamingService.processFileAndEncrypt(req, res);
}

export default fileUploadController;
