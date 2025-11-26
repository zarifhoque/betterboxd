import { z } from 'zod';
import { UserRole } from '../entities/User';
export const userCreateSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(50, { error: 'Username can be at most 50 characters long' }),
    name: z
      .string()
      .min(1, { error: 'Name is required' })
      .max(100, { error: 'Name must be at most 100 characters long' }),
    email: z
      .email({ error: 'Invalid email address' })
      .max(100, { error: 'Email must be at most 100 characters long' }),
    joinDate: z.date().optional(),
    role: z.enum(UserRole).optional(),
  })
  .strict();
export const userUpdateSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(50, { error: 'Username can be at most 50 characters long' }),
    name: z
      .string()
      .min(1, { error: 'Name is required' })
      .max(100, { error: 'Name must be at most 100 characters long' }),
    email: z
      .email({ error: 'Invalid email address' })
      .max(100, { error: 'Email must be at most 100 characters long' }),
    role: z.enum(UserRole).optional(),
  })
  .partial();

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
  startAfter: z.string().optional(),
  search: z.string().optional(),
});

export const getUsersQuerySchema = baseQuerySchema.refine(
  (data) => {
    if ((data.offset !== undefined) !== (data.limit !== undefined)) {
      return false;
    }
    if ((data.page !== undefined) !== (data.itemsPerPage !== undefined)) {
      return false;
    }
    return true;
  },
  {
    message:
      'Pagination params must appear in valid combinations: either offset+limit or page+itemsPerPage',
  },
);
export type UserCreateSchemaType = z.infer<typeof userCreateSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
