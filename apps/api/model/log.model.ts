import { Schema, model, Document } from "mongoose";

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

export default LogSchema;
