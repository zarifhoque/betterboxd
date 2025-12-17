import { Story } from '../../entities/Story';
import { User, UserRole } from '../../entities/User';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../../dtos/StoryDTOs';

// Mock User Data
export const mockUserData: User = {
  userId: '555e4567-e89b-12d3-a456-426614174000',
  username: 'storyteller',
  name: 'Story Teller',
  email: 'storyteller@example.com',
  bio: 'A passionate writer',
  role: UserRole.USER,
  isEmailConfirmed: true,
  joinDate: new Date('2025-01-01'),
  deletedAt: null,
};

// Mock Story Data
export const mockStoryData: Story = {
  storyId: '550e8400-e29b-41d4-a716-446655440010',
  userId: '555e4567-e89b-12d3-a456-426614174000',
  title: 'The Adventure Begins',
  body: 'Once upon a time, in a land far away, there lived a brave hero who embarked on an epic journey to save the kingdom from darkness.',
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-15'),
  deletedAt: null,
  aiSummary: 'A hero embarks on a journey to save a kingdom from darkness.',
  userByUserId: mockUserData,
  categoriesByCategoryId: [
    {
      categoryId: 'cat-1',
      name: 'Fantasy',
      storiesByStoryId: [],
    },
    {
      categoryId: 'cat-2',
      name: 'Adventure',
      storiesByStoryId: [],
    },
  ],
};

// Mock Story 2
export const mockStoryData2: Story = {
  storyId: '550e8400-e29b-41d4-a716-446655440020',
  userId: '555e4567-e89b-12d3-a456-426614174000',
  title: 'Mystery in the Mansion',
  body: 'A detective arrives at a mysterious mansion to solve a decades-old murder case.',
  createdAt: new Date('2025-01-20'),
  updatedAt: new Date('2025-01-20'),
  deletedAt: null,
  aiSummary: 'Detective investigates a cold case at a mysterious mansion.',
  userByUserId: mockUserData,
  categoriesByCategoryId: [
    {
      categoryId: 'cat-3',
      name: 'Mystery',
      storiesByStoryId: [],
    },
  ],
};

// Mock Stories Array
export const mockStoriesArray: Story[] = [mockStoryData, mockStoryData2];

// Story Create DTO
export const storyCreateDTOData: StoryCreateDTO = {
  title: 'The Adventure Begins',
  body: 'Once upon a time, in a land far away, there lived a brave hero who embarked on an epic journey to save the kingdom from darkness.',
};

// Story Update DTO
export const storyUpdateDTOData: StoryUpdateDTO = {
  title: 'The Adventure Continues',
  body: 'The hero discovered new allies and faced greater challenges on their quest to restore peace to the kingdom.',
};

// Story Response DTO
export const mockStoryResponseDTO: StoryResponseDTO = {
  storyId: '550e8400-e29b-41d4-a716-446655440010',
  userId: '555e4567-e89b-12d3-a456-426614174000',
  title: 'The Adventure Begins',
  body: 'Once upon a time, in a land far away, there lived a brave hero who embarked on an epic journey to save the kingdom from darkness.',
  updatedAt: new Date('2025-01-15'),
  username: 'storyteller',
  categoryNames: ['Fantasy', 'Adventure'],
  aiSummary: 'A hero embarks on a journey to save a kingdom from darkness.',
};
