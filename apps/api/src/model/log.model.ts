import { Schema, model } from "mongoose";

export interface ILog {
  message: string;
  level: string;
  stack: string;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    message: { type: String, required: true },
    level: { type: String, required: true },
    stack: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// ----------------------- Indexes -----------------------
LogSchema.index({ createdAt: -1 }); // fast sorting & recent logs fetch
LogSchema.index({ level: 1 }); // filter logs by level
LogSchema.index({ level: 1, createdAt: -1 }); // optimized filter + pagination
LogSchema.index({ message: "text" }); // text index for searching logs

export default LogSchema;
