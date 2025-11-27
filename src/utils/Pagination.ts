export interface PaginationOptions {
  page?: number;
  itemsPerPage?: number;
  offset?: number;
  limit?: number;
  startAfter?: string;
  search?: string;
}

export function parsePaginationOptions(rawQuery: Record<string, unknown>): PaginationOptions {
  return {
    page: rawQuery.page !== undefined ? Number(rawQuery.page) : undefined,
    itemsPerPage: rawQuery.itemsPerPage !== undefined ? Number(rawQuery.itemsPerPage) : undefined,
    offset: rawQuery.offset !== undefined ? Number(rawQuery.offset) : undefined,
    limit: rawQuery.limit !== undefined ? Number(rawQuery.limit) : undefined,
    startAfter: rawQuery.startAfter !== undefined ? String(rawQuery.startAfter) : undefined,
    search: rawQuery.search !== undefined ? String(rawQuery.search) : undefined,
  };
}
