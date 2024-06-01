import { CreateOptions, HydratedDocument } from "mongoose";
import { RowMapper } from "./RowMapper/RowMapper";

/**
 * Base DAO class for all mongo CRUD operations
 * All DAO class must implement this base DAO class
 */
abstract class DmlDAO<T, V> {
  /**
   *
   * @param docs document or document array to be inserted
   * @param rowMapper rowMapper accepts a callback function which executes for every document returned from DB
   * @param options mongoose create options
   */
  abstract create(
    docs: T | T[],
    rowMapper: RowMapper<HydratedDocument<V>>,
    options?: CreateOptions
  ): void;
}

export { DmlDAO };
