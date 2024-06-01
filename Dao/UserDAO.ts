import { IUser } from "./../model/user.model";
import UserModel from "../model/user.model";
import { DmlDAO } from "./DmlDAO";
import { HydratedDocument, CreateOptions } from "mongoose";
import { RowMapper } from "./RowMapper/RowMapper";
import { UserInput } from "../schema/user/userSchema";

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
      let userResultSet: HydratedDocument<IUser> | HydratedDocument<IUser>[];

      if (Array.isArray(docs)) userResultSet = await UserModel.create(docs, options);
      else userResultSet = await UserModel.create(docs);

      if (Array.isArray(userResultSet)) userResultSet.map((row) => rowMapper.mapRow(row));
      else rowMapper.mapRow(userResultSet);
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

const userDAO = new UserDAO();
export { userDAO };
