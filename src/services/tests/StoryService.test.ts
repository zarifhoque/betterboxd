import 'reflect-metadata';
import { StoryService } from '../StoryService';
import { StoryRepository } from '../../repositories/StoryRepository';
import { UserService } from '../UserService';
import { StoryCreateDTO, StoryUpdateDTO } from '../../dtos/StoryDTOs';
import { ErrorFactory } from '../../errors/ErrorFactory';
import { AppDataSource } from '../../database/DataSource';
import * as AISummarization from '../../utils/AISummarization';
import {
  mockStoryData,
  mockStoriesArray,
  storyCreateDTOData,
  storyUpdateDTOData,
  mockUserData,
} from '../../__mocks__/data/Story';

jest.mock('../../repositories/StoryRepository');
jest.mock('../UserService');
jest.mock('../../utils/AISummarization', () => ({
  generateSummary: jest.fn(),
}));

jest.mock('../../database/DataSource', () => ({
  AppDataSource: {
    manager: {
      transaction: jest.fn(),
    },
    getRepository: jest.fn(),
  },
}));

describe('StoryService', () => {
  let storyService: StoryService;
  let storyRepository: jest.Mocked<StoryRepository>;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    storyRepository = new StoryRepository() as jest.Mocked<StoryRepository>;
    userService = new UserService({} as any) as jest.Mocked<UserService>;
    storyService = new StoryService(storyRepository, userService);
    jest.clearAllMocks();
  });

  describe('getAllStories', () => {
    const queryParams = { page: 1, limit: 10 };

    it('returns all stories with pagination', async () => {
      storyRepository.getAllStories.mockResolvedValue(mockStoriesArray);

      const result = await storyService.getAllStories(queryParams);

      expect(result).toHaveLength(mockStoriesArray.length);
      expect(result[0]).toHaveProperty('storyId');
      expect(storyRepository.getAllStories).toHaveBeenCalledWith(queryParams);
    });

    it('returns empty array when no stories found', async () => {
      storyRepository.getAllStories.mockResolvedValue([]);

      const result = await storyService.getAllStories(queryParams);

      expect(result).toEqual([]);
      expect(storyRepository.getAllStories).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getStoryById', () => {
    const storyId = mockStoryData.storyId;

    it('returns story if found', async () => {
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);

      const result = await storyService.getStoryById(storyId);

      expect(result.storyId).toBe(storyId);
      expect(storyRepository.getStoryById).toHaveBeenCalledWith(storyId);
    });

    it('throws not found if story does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      storyRepository.getStoryById.mockResolvedValue(null);

      await expect(storyService.getStoryById(nonExistentId)).rejects.toThrow(
        ErrorFactory.notFound(`Story with the id ${nonExistentId} not found`),
      );
    });

    it('throws error for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';

      await expect(storyService.getStoryById(invalidId)).rejects.toThrow();
    });
  });

  describe('createStory', () => {
    const userId = mockUserData.userId;
    const storyDTO: StoryCreateDTO = storyCreateDTOData;

    it('creates a new story with AI summary', async () => {
      userService.getUserById.mockResolvedValue(mockUserData);
      (AISummarization.generateSummary as jest.Mock).mockResolvedValue('AI generated summary');

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            create: jest.fn().mockReturnValue(mockStoryData),
            save: jest.fn().mockResolvedValue(mockStoryData),
          }),
        };
        return callback(mockTx);
      });

      const result = await storyService.createStory(storyDTO, userId);

      expect(result).toHaveProperty('storyId');
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
      expect(AISummarization.generateSummary).toHaveBeenCalledWith(storyDTO.body);
    });

    it('throws not found if user does not exist', async () => {
      userService.getUserById.mockResolvedValue(undefined as any);

      await expect(storyService.createStory(storyDTO, userId)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${userId} not found`),
      );
    });

    it('creates story even if AI summary generation fails', async () => {
      userService.getUserById.mockResolvedValue(mockUserData);
      (AISummarization.generateSummary as jest.Mock).mockResolvedValue('');

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            create: jest.fn().mockReturnValue({ ...mockStoryData, aiSummary: '' }),
            save: jest.fn().mockResolvedValue({ ...mockStoryData, aiSummary: '' }),
          }),
        };
        return callback(mockTx);
      });

      const result = await storyService.createStory(storyDTO, userId);

      expect(result).toHaveProperty('storyId');
      expect(AISummarization.generateSummary).toHaveBeenCalledWith(storyDTO.body);
    });
  });

  describe('updateStory', () => {
    const storyId = mockStoryData.storyId;
    const updateDTO: StoryUpdateDTO = storyUpdateDTOData;

    it('updates story and regenerates AI summary when body changes', async () => {
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);
      (AISummarization.generateSummary as jest.Mock).mockResolvedValue('New AI summary');

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue({
              ...mockStoryData,
              ...updateDTO,
              aiSummary: 'New AI summary',
            }),
          }),
        };
        return callback(mockTx);
      });

      const result = await storyService.updateStory(storyId, updateDTO);

      expect(result).toHaveProperty('storyId');
      expect(AISummarization.generateSummary).toHaveBeenCalledWith(updateDTO.body);
    });

    it('updates story without regenerating AI summary when body unchanged', async () => {
      const updateWithoutBody: StoryUpdateDTO = { title: 'Updated Title Only' };
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue({
              ...mockStoryData,
              title: updateWithoutBody.title,
            }),
          }),
        };
        return callback(mockTx);
      });

      await storyService.updateStory(storyId, updateWithoutBody);

      expect(AISummarization.generateSummary).not.toHaveBeenCalled();
    });

    it('does not regenerate summary if body is same as existing', async () => {
      const updateWithSameBody: StoryUpdateDTO = { body: mockStoryData.body };
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(mockStoryData),
          }),
        };
        return callback(mockTx);
      });

      await storyService.updateStory(storyId, updateWithSameBody);

      expect(AISummarization.generateSummary).not.toHaveBeenCalled();
    });

    it('throws not found if story does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      storyRepository.getStoryById.mockResolvedValue(null);

      await expect(storyService.updateStory(nonExistentId, updateDTO)).rejects.toThrow(
        ErrorFactory.notFound(`Story with the id ${nonExistentId} not found`),
      );
    });
  });

  describe('deleteStory', () => {
    const storyId = mockStoryData.storyId;

    it('soft deletes a story successfully', async () => {
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);
      storyRepository.softDeleteStory.mockResolvedValue(true);

      await storyService.deleteStory(storyId);

      expect(storyRepository.getStoryById).toHaveBeenCalledWith(storyId);
      expect(storyRepository.softDeleteStory).toHaveBeenCalledWith(storyId);
    });

    it('throws not found if story does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      storyRepository.getStoryById.mockResolvedValue(null);

      await expect(storyService.deleteStory(nonExistentId)).rejects.toThrow(
        ErrorFactory.notFound(`Story with the id ${nonExistentId} not found`),
      );
    });

    it('throws conflict if delete operation fails', async () => {
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);
      storyRepository.softDeleteStory.mockResolvedValue(false);

      await expect(storyService.deleteStory(storyId)).rejects.toThrow(
        ErrorFactory.conflict(`Failed to delete story with id ${storyId}`),
      );
    });

    it('throws error for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';

      await expect(storyService.deleteStory(invalidId)).rejects.toThrow();
    });
  });

  describe('getOwnerId', () => {
    const storyId = mockStoryData.storyId;
    const userId = mockUserData.userId;

    it('returns owner userId for a story', async () => {
      storyRepository.getUserIdByStoryId.mockResolvedValue(userId);

      const result = await storyService.getOwnerId(storyId);

      expect(result).toBe(userId);
      expect(storyRepository.getUserIdByStoryId).toHaveBeenCalledWith(storyId);
    });

    it('throws not found if story does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      storyRepository.getUserIdByStoryId.mockResolvedValue(null);

      await expect(storyService.getOwnerId(nonExistentId)).rejects.toThrow(
        ErrorFactory.notFound(`Story with ID ${nonExistentId} not found`),
      );
    });
  });

  describe('getStoryEntityById', () => {
    const storyId = mockStoryData.storyId;

    it('returns story entity if found', async () => {
      storyRepository.getStoryById.mockResolvedValue(mockStoryData);

      const result = await storyService.getStoryEntityById(storyId);

      expect(result).toEqual(mockStoryData);
      expect(storyRepository.getStoryById).toHaveBeenCalledWith(storyId);
    });

    it('throws not found if story does not exist', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      storyRepository.getStoryById.mockResolvedValue(null);

      await expect(storyService.getStoryEntityById(nonExistentId)).rejects.toThrow(
        ErrorFactory.notFound(`Story with ID ${nonExistentId} not found`),
      );
    });
  });
});
