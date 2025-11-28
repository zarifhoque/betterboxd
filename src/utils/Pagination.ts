import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { QueryParamsSchema } from '../schemas/QuerySchema';
import {
  DEFAULT_PAGE,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_LIMIT,
} from '../constants/PaginationConstants';

export function applyPagination<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  options: QueryParamsSchema,
  alias: string,
): SelectQueryBuilder<T> {
  // Page-based pagination
  if (options.page !== undefined || options.itemsPerPage !== undefined) {
    const page = options.page ?? DEFAULT_PAGE;
    const itemsPerPage = options.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE;
    const skip = (page - 1) * itemsPerPage;
    query.skip(skip).take(itemsPerPage);

    // Offset-based pagination
  } else if (options.offset !== undefined) {
    const limit = options.limit ?? DEFAULT_LIMIT;
    query.skip(options.offset).take(limit);

    // StartAfter-based pagination
  } else if (options.startAfter !== undefined) {
    const limit = options.limit ?? DEFAULT_LIMIT;
    query.where(`${alias}.${alias}Id > :startAfter`, { startAfter: options.startAfter });
    query.take(limit);
  }

  return query;
}
