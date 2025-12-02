import { z } from 'zod';

// Pagination validation logic
const paginationLogic = (data: unknown) => {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  const paginationKeys = ['offset', 'limit', 'page', 'itemsPerPage', 'startAfter'];

  const keys = Object.keys(record).filter(
    (k) => record[k as keyof typeof record] !== undefined && paginationKeys.includes(k),
  );

  // Valid combinations including partial ones for defaults
  const validCombos = [
    ['offset', 'limit'],
    ['offset'],
    ['limit'],
    ['page', 'itemsPerPage'],
    ['page'],
    ['itemsPerPage'],
    ['startAfter', 'limit'],
    ['startAfter'],
    [],
  ];

  // Check if keys match any valid combo exactly
  const isValid = validCombos.some(
    (combo) => combo.every((key) => keys.includes(key)) && keys.every((key) => combo.includes(key)),
  );

  return isValid;
};

const paginationError: string =
  'Pagination params must appear in valid combinations: offset+limit, page+itemsPerPage, or startAfter+limit. ' +
  'You may also provide offset, page, or startAfter alone in which case a default limit/itemsPerPage will be applied.';

// Base schema for individual query params
const basePaginationSchema = z
  .object({
    page: z.coerce
      .number({ error: 'Page number must be a number' })
      .int({ error: 'Page number must be an integer value' })
      .min(1, { error: 'Page number must be at least 1' }),
    itemsPerPage: z.coerce
      .number({ error: 'Items per page must be a number' })
      .int({ error: 'Items per page must be an integer value' })
      .min(1, { error: 'Items per page must be at least 1' }),
    offset: z.coerce
      .number({ error: 'Offset must be a number' })
      .int({ error: 'Offset must be an integer value' })
      .min(0, { error: 'Offset must be at least 0' }),
    limit: z.coerce
      .number({ error: 'Limit must be a number' })
      .int({ error: 'Limit must be an integer value' })
      .min(1, { error: 'Limit must be at least 1' }),
    startAfter: z.uuid(),
    search: z.string(),
  })
  .partial()
  .strict();

// Refine with pagination validation
export const paginationSchema = basePaginationSchema.refine(paginationLogic, {
  message: paginationError,
});

// Type export
export type PaginationSchemaType = z.infer<typeof paginationSchema>;
