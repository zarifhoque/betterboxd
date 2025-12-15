import { z } from 'zod';

export const storyCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be at most 255 characters long'),
    body: z
      .string()
      .min(1, 'Body is required')
      .max(10000, 'Body must be at most 10000 characters long'),
  })
  .strict();

export const storyUpdateSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be at most 255 characters long'),
    body: z
      .string()
      .min(1, 'Body is required')
      .max(10000, 'Body must be at most 10000 characters long'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  })
  .strict();
export type StoryCreateSchemaType = z.infer<typeof storyCreateSchema>;
export type StoryUpdateSchemaType = z.infer<typeof storyUpdateSchema>;
