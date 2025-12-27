import config from "config";
import UserModel from "../model/user.model";
import { UserRoleModel } from "../model/userRole.model";

export async function seedAdmin() {
  const adminEmails: string[] = config.get("ADMIN_EMAILS");

  for (const email of adminEmails) {
    const user = await UserModel.findOne({ email });
    if (!user) continue;

    const exists = await UserRoleModel.findOne({ userId: user._id, role: "admin" });
    if (!exists) await UserRoleModel.create({ userId: user._id, role: "admin" });
  }
}
