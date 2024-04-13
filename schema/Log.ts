import { Schema, InferSchemaType } from "mongoose";

// Schema
const LogSchema = new Schema(
  {
    message: { type: String, required: true },
    level: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "Timestamp",
    },
  }
);

export type LogSchemaType = InferSchemaType<typeof LogSchema> & { timestamp: string };

export default LogSchema;
