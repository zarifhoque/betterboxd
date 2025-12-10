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
    categoryNames: z
      .preprocess(
        (categoryNames) => {
          if (!Array.isArray(categoryNames)) return [];
          const normalized = categoryNames.map((categoryName) =>
            String(categoryName).trim().toLowerCase(),
          );
          return Array.from(new Set(normalized));
        },
        z.array(z.string().min(1)),
      )
      .optional(),
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
    categoryNames: z
      .preprocess(
        (categoryNames) => {
          if (!Array.isArray(categoryNames)) return undefined;
          const normalized = categoryNames.map((categoryName) =>
            String(categoryName).trim().toLowerCase(),
          );
          return Array.from(new Set(normalized));
        },
        z.array(z.string().min(1)),
      )
      .optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  })
  .strict();
export type StoryCreateSchemaType = z.infer<typeof storyCreateSchema>;
export type StoryUpdateSchemaType = z.infer<typeof storyUpdateSchema>;
