import { userDoc } from "../../Dao/UserDAO";
import RedisPubSub from "../../redis";
import MailBuilder from "../../utilityClasses/mail/MailBuilder";
import renderEJS from "../../viewsRender/renderEjs";

class SendMail {
  async sendErrorMail(err: Error) {
    const mail = new MailBuilder();

    mail
      .setFrom("Msgbits Team msgbits07@gmail.com")
      .setTo("a61ashwanikumar@gmail.com; mritunjaykr160@gmail.com;ankitkumar38203@gmail.com")
      .setSubject("Mail From Msgbits App")
      .setMailSalutation("Hi Admin,")
      .setMailSignature(`Thanks & Regards,\nMsgbits Team`);

    const html = await renderEJS.renderEJS("ERROR_MAIL", {
      mail,
      err,
      stack: err.stack || "Stack is empty",
    });
    mail.setHtml(html);
    // add mail to redis mail queue
    RedisPubSub.getInstance().mailQueue.add("send error mail to Admin", mail);
  }
  async sendOTPtoUser(user: userDoc) {
    const mail = new MailBuilder();

    mail
      .setFrom("Msgbits Team msgbits07@gmail.com")
      .setTo(user.email)
      .setSubject("Mail From Msgbits App");

    const html = await renderEJS.renderEJS("OTP_MAIL", {
      name: user.name,
      otp: user.authCode,
    });
    mail.setHtml(html);
    // add mail to redis mail queue
    RedisPubSub.getInstance().mailQueue.add("send otp to user", mail);
  }
}

const sendMail = new SendMail();
export { sendMail };
