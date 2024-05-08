import type Mail from "../utilityClasses/mail/Mail";

type ViewType = "ERROR_MAIL" | "OTP_MAIL";
interface errorTemplateMail {
  mail: Mail;
  err: Error;
  stack: string;
}

interface otpTemplateOTP {
  user: string;
  otp: number;
}

type renderEJSopts = errorTemplateMail | otpTemplateOTP;

export { renderEJSopts, ViewType };
