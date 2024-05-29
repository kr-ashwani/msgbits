import { NextFunction, Request, Response } from "express";

/**
 * It wraps async function and if returned promise is rejected, it calls next which eventually calls ExpressErrorHAndler
 * @param callback
 * @returns
 */
function asyncWrapper(callback: (req: Request, res: Response) => void) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(callback(req, res)).catch((err) => next(err));
  };
}

export default asyncWrapper;
