import { z } from 'zod';

// Base schema for individual params
const baseQuerySchema = z.object({
  page: z.coerce
    .number({ error: 'Page number must be a number' })
    .int({ error: 'Page number must be an integer value' })
    .min(1, { error: 'Page number must be at least 1' })
    .optional(),
  itemsPerPage: z.coerce
    .number({ error: 'Items per page must be a number' })
    .int({ error: 'Items per page must be an integer value' })
    .min(1, { error: 'Items per page must be at least 1' })
    .optional(),
  offset: z.coerce
    .number({ error: 'Offset must be a number' })
    .int({ error: 'Offset must be an integer value' })
    .min(0, { error: 'Offset must be at least 0' })
    .optional(),
  limit: z.coerce
    .number({ error: 'Limit must be a number' })
    .int({ error: 'Limit must be an integer value' })
    .min(1, { error: 'Limit must be at least 1' })
    .optional(),
  startAfter: z.uuid().optional(),
  search: z.string().optional(),
});

export const queryParamsSchema = baseQuerySchema.refine(
  (data) => {
    const keys = Object.keys(data).filter((k) => data[k as keyof typeof data] !== undefined);

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
      (combo) =>
        combo.every((key) => keys.includes(key)) && keys.every((key) => combo.includes(key)),
    );

    return isValid;
  },
  {
    message:
      'Pagination params must appear in valid combinations: either offset+limit or page+itemsPerPage or startAfter+limit. Alternatively, you can also simply provide offset or startAfter in which case a default value of limit will be assumed',
  },
);

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;
