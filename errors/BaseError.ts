interface baseErrorParams {
  message: string;
  name: string;
  code: string;
}

class BaseError extends Error {
  code: string;

  constructor(baseErrorParams: baseErrorParams) {
    super();
    this.message = baseErrorParams.message;
    this.name = baseErrorParams.message;
    this.code = baseErrorParams.code;
  }
}

export default BaseError;
