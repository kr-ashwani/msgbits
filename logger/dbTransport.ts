import Transport, { TransportStreamOptions } from "winston-transport";
import type { LogEntry } from "winston";
import writeLogsToDB from "../service/LogService";

export default class dbTansport extends Transport {
  private db: string | undefined;
  private collection: string | undefined;
  constructor(opts: TransportStreamOptions, dbConn?: { db: string; collection: string }) {
    super(opts);
    this.db = dbConn?.db || undefined;
    this.collection = dbConn?.collection || undefined;
  }

  // this functions run when something is logged so here's where you can add you custom logic to do stuff when something is logged.
  log(info: LogEntry, callback: any) {
    //default behavior
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...meta } = info;
    // here you can add your custom logic, e.g. ingest data into database etc.
    writeLogsToDB({
      log: {
        level,
        message,
      },
      db: this.db,
      collection: this.collection,
    });

    // don't forget this one
    callback();
  }
}
