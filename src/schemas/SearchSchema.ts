import { z } from 'zod';

// User search schema
export const userSearchSchema = z
  .object({
    name: z
      .string()
      .refine((v) => !v || v.length > 0, { message: 'Name must not be empty if provided' }),
    email: z
      .email({ error: 'Invalid email address' })
      .max(100, { error: 'Email must be at most 100 characters long' }),
  })
  .partial()
  .strict();

// Story search schema
export const storySearchSchema = z
  .object({
    title: z
      .string()
      .refine((v) => !v || v.length > 0, { message: 'Title must not be empty if provided' }),
    author: z
      .string()
      .refine((v) => !v || v.length > 0, { message: 'Author must not be empty if provided' }),
    createdAfter: z.string().refine((v) => !v || !isNaN(Date.parse(v)), {
      message: 'createdAfter must be a valid datetime if provided',
    }),
    createdBefore: z.string().refine((v) => !v || !isNaN(Date.parse(v)), {
      message: 'createdBefore must be a valid datetime if provided',
    }),
  })
  .strict()
  .partial();

// Type export
export type UserSearchQuerySchemaType = z.infer<typeof userSearchSchema>;
export type StorySearchQuerySchemaType = z.infer<typeof storySearchSchema>;
