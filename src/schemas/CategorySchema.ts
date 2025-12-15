import { z } from 'zod';

export const addCategorySchema = z.object({
  category: z.preprocess(
    (category) => {
      if (typeof category === 'string') return category.trim().toLowerCase();
      return category;
    },
    z
      .string()
      .min(1, 'Tag name is required')
      .max(50, 'Tag name must be at most 50 characters long'),
  ),
});

export const removeCategorySchema = z.object({
  category: z.preprocess(
    (category) => {
      if (typeof category === 'string') return category.trim().toLowerCase();
      return category;
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
