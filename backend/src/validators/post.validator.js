import { z } from 'zod';

export const CATEGORIES = [
  'Technology',
  'DevOps',
  'Programming',
  'Database',
  'Frontend',
  'Backend',
  'Other'
];

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(150, { message: 'Title cannot exceed 150 characters' }),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long' }),
  category: z
    .enum(CATEGORIES, {
      errorMap: () => ({
        message: `Category must be one of: ${CATEGORIES.join(', ')}`
      })
    })
    .default('Technology')
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(150, { message: 'Title cannot exceed 150 characters' })
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .optional(),
  category: z
    .enum(CATEGORIES, {
      errorMap: () => ({
        message: `Category must be one of: ${CATEGORIES.join(', ')}`
      })
    })
    .optional()
});
