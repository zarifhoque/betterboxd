import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { QueryParamsSchema } from '../schemas/QuerySchema';

export function applyPagination<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  options: QueryParamsSchema,
  alias: string,
): SelectQueryBuilder<T> {
  if (options.page !== undefined && options.itemsPerPage !== undefined) {
    const skip = (options.page - 1) * options.itemsPerPage;
    query.skip(skip).take(options.itemsPerPage);
  } else if (options.offset !== undefined && options.limit !== undefined) {
    query.skip(options.offset).take(options.limit);
  } else if (options.startAfter && options.limit !== undefined) {
    query.where(`${alias}.${alias}Id > :startAfter`, { startAfter: options.startAfter });
    query.take(options.limit);
  }

  return query;
}
