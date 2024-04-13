import BaseError from "./BaseError";
import errorCode from "./errorCode";

class DbCollectionMissingError extends BaseError {
  constructor(errMsg: string) {
    super({
      message: errMsg,
      name: "DbCollectionMissingError",
      code: errorCode.DbCollectionMissing,
    });
  }
}

export default DbCollectionMissingError;
