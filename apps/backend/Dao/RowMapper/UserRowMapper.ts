import { HydratedDocument } from "mongoose";
import { IUser } from "../../model/user.model";
import { RowMapper } from "./RowMapper";

class UserRowMapper extends RowMapper<HydratedDocument<IUser>> {
  private callbackFunc: (user: HydratedDocument<IUser>) => void;

  constructor(callback: (user: HydratedDocument<IUser>) => void) {
    super();
    this.callbackFunc = callback;
  }
  mapRow(data: HydratedDocument<IUser>) {
    this.callbackFunc(data);
  }
}

export { UserRowMapper };
