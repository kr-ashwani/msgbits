import { IUser } from "./../model/user.model";
import UserModel from "../model/user.model";
import { DmlDAO } from "./DmlDAO";
import { HydratedDocument, CreateOptions } from "mongoose";
import { RowMapper } from "./RowMapper/RowMapper";
import { UserInput } from "../schema/user/userSchema";
import { MathUtil } from "../utils/MathUtil";
import { sendMail } from "../service/mail/sendMail";

export type userDoc = Omit<IUser, "createdAt" | "updatedAt" | "comparePassword">;
class UserDAO extends DmlDAO<UserInput, IUser> {
  /**
   *
   * @param docs UserInput or UserInput Array
   * @param rowMapper
   * @param options
   */
  async create(
    docs: UserInput | UserInput[],
    rowMapper: RowMapper<HydratedDocument<IUser>>,
    options?: CreateOptions
  ) {
    try {
      const userDocs: userDoc[] = [];
      if (!Array.isArray(docs)) docs = [docs];

      docs.forEach((doc) => {
        const isVerified = false;
        const authCode = MathUtil.generateRandomNumber(100000, 999999);
        const authCodeValidTime = Date.now() + 5 * 60 * 1000;
        const user = { ...doc, isVerified, authCode, authCodeValidTime };
        sendMail.sendOTPtoUser(user);
        userDocs.push(user);
      });

      const userResultSet = await UserModel.create(userDocs, options);

      userResultSet.map((row) => rowMapper.mapRow(row));
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

const userDAO = new UserDAO();
export { userDAO };
