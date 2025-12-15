import { z } from 'zod';

export const addCategorySchema = z.object({
  tag: z.preprocess(
    (tag) => {
      if (typeof tag === 'string') return tag.trim().toLowerCase();
      return tag;
    },
    z
      .string()
      .min(1, 'Tag name is required')
      .max(50, 'Tag name must be at most 50 characters long'),
  ),
});

export const removeCategorySchema = z.object({
  tag: z.preprocess(
    (tag) => {
      if (typeof tag === 'string') return tag.trim().toLowerCase();
      return tag;
    },
    z
      .string()
      .min(1, 'Tag name is required')
      .max(50, 'Tag name must be at most 50 characters long'),
  ),
});

export const storyIdParamSchema = z.object({
  storyId: z.uuid('Invalid storyId, must be a UUID'),
});
