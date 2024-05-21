import BaseError from "../errors/BaseError";
import sendErrToLogger from "./sendErrToLogger";
import sendMailToAdminIfCritical from "./sendErrToMail";

/**
 * @param err
 * This is the centralised Error Handler.
 * All Error must pass through this centralised handler
 */
async function handleError(err: BaseError): Promise<void> {
  sendErrToLogger(err);
  if (err.isCritical) await sendMailToAdminIfCritical(err);
  //await sendEventsToSentry();
}

export default handleError;
