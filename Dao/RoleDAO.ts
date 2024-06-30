import {
  QuerySelector,
  RootQuerySelector,
  HydratedDocument,
  CreateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import RoleModel, { IRole } from "../model/role.model";
import { DmlDAO } from "./DmlDAO";
import { RowMapper } from "./RowMapper/RowMapper";

type Condition<T> = T | QuerySelector<T | any>;
type FilterQuery<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & RootQuerySelector<T>;

class RoleDAO extends DmlDAO<IRole, IRole> {
  /**
   *
   * @param docs IRole or IRole Array
   * @param rowMapper
   * @param options
   */
  async create(
    docs: IRole | IRole[],
    rowMapper: RowMapper<HydratedDocument<IRole>>,
    options?: CreateOptions
  ) {
    try {
      const userDocs: IRole[] = [];

      const userRoleResultSet = await RoleModel.create(userDocs, options);

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
    filter: FilterQuery<IRole>,
    rowMapper: RowMapper<HydratedDocument<IRole>>,
    projection?: ProjectionType<IRole> | null | undefined,
    options?: QueryOptions<IRole> | null | undefined
  ) {
    try {
      const userResultSet = await RoleModel.find(filter, projection, options);

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
    filter: FilterQuery<IRole>,
    update: UpdateQuery<IRole>,
    rowMapper: RowMapper<HydratedDocument<IRole>>,
    options?: QueryOptions<IRole> | null | undefined
  ) {
    try {
      const userResultSet = await RoleModel.findOneAndUpdate(filter, update, options);
      if (userResultSet) rowMapper.mapRow(userResultSet);
    } catch (err: any) {
      throw err;
    }
  }
}

const roleDAO = new RoleDAO();
export { roleDAO };
