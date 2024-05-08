import config from "config";
import nodemailer from "nodemailer";
import { MailParams } from "../utilityClasses/mail/Mail";
import logger from "../logger";

class MailService {
  private static instance: MailService;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = this.createConnection();
  }
  //Instance of Mail Service
  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }
  //Mail config
  private mailConfig() {
    return {
      service: config.get<string>("SMTP_SERVICE"),
      port: config.get<number>("SMTP_PORT"),
      secure: config.get<boolean>("SMTP_SECURE"),
      auth: {
        user: config.get<string>("SMTP_USER"),
        pass: config.get<string>("SMTP_PASS"),
      },
    };
  }

  //create a connection
  createConnection() {
    return (this.transporter = nodemailer.createTransport(this.mailConfig()));
  }
  //send Mail
  public async sendMail(mail: MailParams) {
    try {
      await this.transporter.sendMail(mail);
      logger.info(`Mail sent successfully to ${mail.to} with subject ${mail.subject}`);
    } catch (err: any) {
      console.error("failed to send mail bacause ", err.message);
    }
  }
}

const mailService = MailService.getInstance();
export default mailService;
