import redisPubSub from "../redis";
import MailBuilder from "../utilityClasses/mail/MailBuilder";
import renderEJS from "../viewsRender/renderEjs";

async function sendMailToAdminIfCritical(err: Error) {
  const mail = new MailBuilder();

  mail
    .setFrom("Msgbits Team msgbits07@gmail.com")
    .setTo("a61ashwanikumar@gmail.com; mritunjaykr160@gmail.com")
    .setSubject("Mail From Msgbits App")
    .setMailSalutation("Hi Admin,")
    .setMailSignature(`Thanks & Regards,\nMsgbits Team`);

  const html = await renderEJS.renderEJS("ERROR_MAIL", {
    mail,
    err,
    stack: getSimplifiedStack(err),
  });
  mail.setHtml(html);
  // add mail to redis mail queue
  redisPubSub.mailQueue.add("send error mail to Admin", mail);
}

function getSimplifiedStack(err: Error) {
  if (err.stack) {
    const stackArr = err.stack.split("\n");
    const newStackArr = [];
    for (let i = 0; i <= 3 && i < stackArr.length; i++) newStackArr.push(stackArr[i]);
    const newStack = newStackArr.join("\n");
    const simplifiedStack = `${newStack}\n +${err.stack.length - newStack.length}more.`;
    return simplifiedStack;
  }
  return "";
}

export default sendMailToAdminIfCritical;
