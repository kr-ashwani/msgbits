import { HydratedDocument } from "mongoose";
import { IRole } from "../../model/role.model";
import { RowMapper } from "./RowMapper";

class RoleRowMapper extends RowMapper<HydratedDocument<IRole>> {
  private callbackFunc: (user: HydratedDocument<IRole>) => void;

  constructor(callback: (user: HydratedDocument<IRole>) => void) {
    super();
    this.callbackFunc = callback;
  }
  mapRow(data: HydratedDocument<IRole>) {
    this.callbackFunc(data);
  }
}

export { RoleRowMapper };
