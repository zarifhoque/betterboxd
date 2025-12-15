import { z } from 'zod';
import { UserRole } from '../entities/User';

export const userCreateSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(50, { error: 'Username can be at most 50 characters long' })
      .regex(/^[^\s]+$/, { error: 'Username cannot contain spaces' })
      .regex(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]$)[a-zA-Z0-9._-]+$/, {
        error: 'Username contains invalid characters or formatting',
      }),
    name: z
      .string()
      .min(1, { error: 'Name is required' })
      .max(100, { error: 'Name must be at most 100 characters long' }),
    bio: z
      .string()
      .min(1, 'Bio is required')
      .max(10000, 'Bio must be at most 10000 characters long'),
    email: z
      .email({ error: 'Invalid email address' })
      .max(100, { error: 'Email must be at most 100 characters long' }),
    joinDate: z.date().optional(),
  })
  .strict();

export const userUpdateSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(50, { error: 'Username can be at most 50 characters long' })
      .regex(/^[^\s]+$/, { error: 'Username cannot contain spaces' })
      .regex(/^(?![._-])(?!.*[._-]{2})(?!.*[._-]$)[a-zA-Z0-9._-]+$/, {
        error: 'Username contains invalid characters or formatting',
      }),
    name: z
      .string()
      .min(1, { error: 'Name is required' })
      .max(100, { error: 'Name must be at most 100 characters long' }),
    bio: z
      .string()
      .min(1, 'Bio is required')
      .max(10000, 'Bio must be at most 10000 characters long'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  })
  .strict();

export const userSignupSchema = z
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
    password: z
      .string()
      .min(6)
      .max(128, { error: 'Password can be at most 128 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  })
  .strict();

export const userLoginSchema = z
  .object({
    email: z
      .email({ error: 'Invalid email address' })
      .max(100, { error: 'Email must be at most 100 characters long' }),
    password: z
      .string()
      .min(6)
      .max(128, { error: 'Password should have been be at most 128 characters long' }),
  })
  .strict();

export const userUpdateRoleSchema = z.object({
  role: z.enum(UserRole),
});

export const passwordChangeRequestSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

export const passwordChangeConfirmSchema = z.object({
  token: z.uuid(),
});

export type UserUpdateRoleSchemaType = z.infer<typeof userUpdateRoleSchema>;

export type UserCreateSchemaType = z.infer<typeof userCreateSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
