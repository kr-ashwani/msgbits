import ejs from "ejs";
import path from "path";
import { renderEJSopts, ViewType } from "./renderEjsTypes";

class RenderEJS {
  private viewLocation = new Map<ViewType, string>();

  constructor() {
    this.viewLocation.set("ERROR_MAIL", path.join(__dirname, "../views/mail/errorTemplate.ejs"));
  }
  /**
   * Convert dynamic HTML(ejs) to string format
   * @param object of type { mail:Mail, err:Error,  stack:string}
   * @returns string representing HTML of mail body
   */
  public async renderEJS(view: ViewType, opts: renderEJSopts) {
    const ejsPath = this.viewLocation.get(view);
    try {
      if (!ejsPath) throw new Error("ejs Path is undefined");
      const htmlBody = await ejs.renderFile(ejsPath, opts);
      return htmlBody;
    } catch (err: unknown) {
      if (err instanceof Error) return this.failedRenderEJS(err);
      return "";
    }
  }

  private async failedRenderEJS(err: Error) {
    const ejsPath = path.join(__dirname, "../views/viewRenderError.ejs");
    try {
      const htmlBody = await ejs.renderFile(ejsPath, { err });
      return htmlBody;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("failed to render Ejs because ", err.message);
        return `"failed to render Ejs because ${err.message}`;
      }
      return "failed to render Ejs at viewsRender/renderEjs.ts file";
    }
  }
}

const renderEJS = new RenderEJS();
export default renderEJS;
