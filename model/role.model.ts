import { Document, Schema, Types, model } from "mongoose";
import UserModel from "./user.model";

export type IRole = {
  role: "admin" | "user";
  userId: Types.ObjectId;
};
// Role Schema
const roleSchema = new Schema<IRole>(
  {
    role: {
      type: String,
      required: [true, "role type is missing"],
      default: "user",
    },
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const RoleModel = model<IRole>("Role", roleSchema);
export default RoleModel;

async function demo() {
  const a = await UserModel.find();
  console.log(a[0]);
  RoleModel.create({ type: "admin", userId: a[0]._id.toString() });
}
console.log("jo");
setTimeout(() => {
  demo();
}, 5000);
