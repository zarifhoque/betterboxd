import { Category } from '../../entities/Category';

// Mock Category Data
export const mockCategoryData: Category = {
  categoryId: '550e8400-e29b-41d4-a716-446655440020',
  name: 'Fantasy',
  storiesByStoryId: [],
};

export const mockCategoryData2: Category = {
  categoryId: '550e8400-e29b-41d4-a716-446655440021',
  name: 'Adventure',
  storiesByStoryId: [],
};

export const mockCategoryData3: Category = {
  categoryId: '550e8400-e29b-41d4-a716-446655440022',
  name: 'Mystery',
  storiesByStoryId: [],
};

export const mockCategoriesArray: Category[] = [
  mockCategoryData,
  mockCategoryData2,
  mockCategoryData3,
];
