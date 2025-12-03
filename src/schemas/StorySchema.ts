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
    userByUserId: z.uuid(), // can no longer pass userId to create story and has to be done from the jwt token
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
  .strict();
export type StoryCreateSchemaType = z.infer<typeof storyCreateSchema>;
export type StoryUpdateSchemaType = z.infer<typeof storyUpdateSchema>;
