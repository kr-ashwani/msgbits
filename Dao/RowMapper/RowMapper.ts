/**
 * Base Row Mapper class . Every Row Mapper must extend this class
 * mapRwo function will be called for every documents returns from DB querry
 */
abstract class RowMapper<T> {
  abstract mapRow(data: T): void;
}

export { RowMapper };
