import {
  QuerySelector,
  RootQuerySelector,
  HydratedDocument,
  CreateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { DmlDAO } from "./DmlDAO";
import { RowMapper } from "./RowMapper/RowMapper";
import { IUserRole, UserRoleModel } from "../model/userRole.model";

type Condition<T> = T | QuerySelector<T | any>;
type FilterQuery<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & RootQuerySelector<T>;

class UserRoleDAO extends DmlDAO<IUserRole, IUserRole> {
  /**
   *
   * @param docs IRole or IRole Array
   * @param rowMapper
   * @param options
   */
  async create(
    docs: IUserRole | IUserRole[],
    rowMapper: RowMapper<HydratedDocument<IUserRole>>,
    options?: CreateOptions
  ) {
    try {
      const userDocs: IUserRole[] = [];

      const userRoleResultSet = await UserRoleModel.create(userDocs, options);

      userRoleResultSet.map((row) => rowMapper.mapRow(row));
    } catch (err: any) {
      throw err;
    }
  }
  /**
   *
   * @param filter
   * @param rowMapper
   * @param projection
   * @param options
   */
  async find(
    filter: FilterQuery<IUserRole>,
    rowMapper: RowMapper<HydratedDocument<IUserRole>>,
    options?: QueryOptions<IUserRole> | null | undefined,
    projection?: ProjectionType<IUserRole> | null | undefined
  ) {
    try {
      const userResultSet = await UserRoleModel.find(filter, projection, options);

      userResultSet.map((row) => rowMapper.mapRow(row));
    } catch (err: any) {
      throw err;
    }
  }

  /**
   *
   * @param filter
   * @param update
   * @param rowMapper
   * @param options
   */
  async update(
    filter: FilterQuery<IUserRole>,
    update: UpdateQuery<IUserRole>,
    rowMapper: RowMapper<HydratedDocument<IUserRole>>,
    options?: QueryOptions<IUserRole> | null | undefined
  ) {
    try {
      const userResultSet = await UserRoleModel.findOneAndUpdate(filter, update, options);
      if (userResultSet) rowMapper.mapRow(userResultSet);
    } catch (err: any) {
      throw err;
    }
  }
}

const userRoleDAO = new UserRoleDAO();
export { userRoleDAO };
