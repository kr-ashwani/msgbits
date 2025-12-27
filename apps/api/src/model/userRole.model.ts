import { Schema, Types, model } from "mongoose";

export interface IUserRole {
  userId: Types.ObjectId;
  role: "admin" | "user" | "moderator" | "editor" | "support";
  assignedBy?: Types.ObjectId;
  expiresAt?: Date;
}

const userRoleSchema = new Schema<IUserRole>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: [true, "User ID is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "moderator", "editor", "support"],
      required: [true, "Role is required"],
      index: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

// composite index to prevent duplicate role assignment per user
userRoleSchema.index({ userId: 1, role: 1 }, { unique: true });

export const UserRoleModel = model<IUserRole>("UserRole", userRoleSchema);
