import 'reflect-metadata';
import { CategoryService } from '../CategoryService';
import { CategoryRepository } from '../../repositories/CategoryRepository';
import { StoryService } from '../StoryService';
import { AppDataSource } from '../../database/DataSource';
import {
  mockCategoryData,
  mockCategoryData2,
  mockCategoryData3,
} from '../../__mocks__/data/Category';
import { mockStoryData, mockUserData } from '../../__mocks__/data/Story';

jest.mock('../../repositories/CategoryRepository');
jest.mock('../StoryService');
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

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepo: jest.Mocked<CategoryRepository>;
  let storyService: jest.Mocked<StoryService>;

  beforeEach(() => {
    categoryRepo = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    storyService = new StoryService({} as any, {} as any) as jest.Mocked<StoryService>;
    categoryService = new CategoryService(categoryRepo, storyService);
    jest.clearAllMocks();
  });

  describe('ensureCategories', () => {
    it('returns empty array when no category names provided', async () => {
      const result = await categoryService.ensureCategories([]);

      expect(result).toEqual([]);
      expect(categoryRepo.findByName).not.toHaveBeenCalled();
      expect(categoryRepo.createCategory).not.toHaveBeenCalled();
    });

    it('returns empty array when undefined is passed', async () => {
      const result = await categoryService.ensureCategories(undefined);

      expect(result).toEqual([]);
      expect(categoryRepo.findByName).not.toHaveBeenCalled();
      expect(categoryRepo.createCategory).not.toHaveBeenCalled();
    });

    it('returns existing category if found', async () => {
      categoryRepo.findByName.mockResolvedValue(mockCategoryData);

      const result = await categoryService.ensureCategories(['Fantasy']);

      expect(result).toEqual([mockCategoryData]);
      expect(categoryRepo.findByName).toHaveBeenCalledWith('Fantasy');
      expect(categoryRepo.createCategory).not.toHaveBeenCalled();
    });

    it('creates new category if not found', async () => {
      categoryRepo.findByName.mockResolvedValue(null);
      categoryRepo.createCategory.mockResolvedValue(mockCategoryData);

      const result = await categoryService.ensureCategories(['Fantasy']);

      expect(result).toEqual([mockCategoryData]);
      expect(categoryRepo.findByName).toHaveBeenCalledWith('Fantasy');
      expect(categoryRepo.createCategory).toHaveBeenCalledWith('Fantasy');
    });

    it('handles multiple categories with mix of existing and new', async () => {
      categoryRepo.findByName
        .mockResolvedValueOnce(mockCategoryData) // Fantasy exists
        .mockResolvedValueOnce(null); // Adventure doesn't exist
      categoryRepo.createCategory.mockResolvedValue(mockCategoryData2);

      const result = await categoryService.ensureCategories(['Fantasy', 'Adventure']);

      expect(result).toHaveLength(2);
      expect(categoryRepo.findByName).toHaveBeenCalledTimes(2);
      expect(categoryRepo.createCategory).toHaveBeenCalledTimes(1);
      expect(categoryRepo.createCategory).toHaveBeenCalledWith('Adventure');
    });

    it('processes categories sequentially', async () => {
      categoryRepo.findByName
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      categoryRepo.createCategory
        .mockResolvedValueOnce(mockCategoryData)
        .mockResolvedValueOnce(mockCategoryData2)
        .mockResolvedValueOnce(mockCategoryData3);

      const result = await categoryService.ensureCategories(['Fantasy', 'Adventure', 'Mystery']);

      expect(result).toHaveLength(3);
      expect(categoryRepo.findByName).toHaveBeenCalledTimes(3);
      expect(categoryRepo.createCategory).toHaveBeenCalledTimes(3);
    });
  });

  describe('listCategoriesByStoryId', () => {
    const storyId = mockStoryData.storyId;

    it('returns category names for a story', async () => {
      const storyResponse = {
        ...mockStoryData,
        categoryNames: ['Fantasy', 'Adventure'],
      };
      storyService.getStoryById.mockResolvedValue(storyResponse as any);

      const result = await categoryService.listCategoriesByStoryId(storyId);

      expect(result).toEqual(['Fantasy', 'Adventure']);
      expect(storyService.getStoryById).toHaveBeenCalledWith(storyId);
    });

    it('returns empty array when story has no categories', async () => {
      const storyResponse = {
        ...mockStoryData,
        categoryNames: [],
      };
      storyService.getStoryById.mockResolvedValue(storyResponse as any);

      const result = await categoryService.listCategoriesByStoryId(storyId);

      expect(result).toEqual([]);
    });

    it('returns empty array when categoryNames is undefined', async () => {
      const storyResponse = {
        ...mockStoryData,
        categoryNames: undefined,
      };
      storyService.getStoryById.mockResolvedValue(storyResponse as any);

      const result = await categoryService.listCategoriesByStoryId(storyId);

      expect(result).toEqual([]);
    });

    it('throws error if story not found', async () => {
      storyService.getStoryById.mockRejectedValue(new Error('Story not found'));

      await expect(categoryService.listCategoriesByStoryId(storyId)).rejects.toThrow(
        'Story not found',
      );
    });
  });

  describe('addCategoryToStory', () => {
    const userId = mockUserData.userId;
    const storyId = mockStoryData.storyId;
    const categoryName = 'SciFi';

    it('adds new category to story successfully', async () => {
      const storyWithoutCategory = {
        ...mockStoryData,
        categoriesByCategoryId: [],
      };

      categoryRepo.findByName.mockResolvedValue(null);
      categoryRepo.createCategory.mockResolvedValue(mockCategoryData3);
      storyService.getStoryEntityById.mockResolvedValue(storyWithoutCategory);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithoutCategory),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.addCategoryToStory(userId, storyId, categoryName);

      expect(categoryRepo.findByName).toHaveBeenCalledWith(categoryName);
      expect(categoryRepo.createCategory).toHaveBeenCalledWith(categoryName);
      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('adds existing category to story', async () => {
      const storyWithoutCategory = {
        ...mockStoryData,
        categoriesByCategoryId: [],
      };

      categoryRepo.findByName.mockResolvedValue(mockCategoryData);
      storyService.getStoryEntityById.mockResolvedValue(storyWithoutCategory);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithoutCategory),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.addCategoryToStory(userId, storyId, categoryName);

      expect(categoryRepo.findByName).toHaveBeenCalledWith(categoryName);
      expect(categoryRepo.createCategory).not.toHaveBeenCalled();
      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('does not add category if already exists on story', async () => {
      const storyWithCategory = {
        ...mockStoryData,
        categoriesByCategoryId: [mockCategoryData],
      };

      categoryRepo.findByName.mockResolvedValue(mockCategoryData);
      storyService.getStoryEntityById.mockResolvedValue(storyWithCategory);

      const mockSave = jest.fn();
      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: mockSave,
          }),
        };
        return callback(mockTx);
      });

      await categoryService.addCategoryToStory(userId, storyId, mockCategoryData.name);

      expect(mockSave).not.toHaveBeenCalled();
    });

    it('handles story with undefined categories array', async () => {
      const storyWithoutCategories = {
        ...mockStoryData,
        categoriesByCategoryId: undefined,
      };

      categoryRepo.findByName.mockResolvedValue(mockCategoryData);
      storyService.getStoryEntityById.mockResolvedValue(storyWithoutCategories as any);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithoutCategories),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.addCategoryToStory(userId, storyId, categoryName);

      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('throws error if story not found', async () => {
      categoryRepo.findByName.mockResolvedValue(mockCategoryData);
      storyService.getStoryEntityById.mockRejectedValue(new Error('Story not found'));

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        return callback({});
      });

      await expect(
        categoryService.addCategoryToStory(userId, storyId, categoryName),
      ).rejects.toThrow('Story not found');
    });
  });

  describe('removeCategoryFromStory', () => {
    const userId = mockUserData.userId;
    const storyId = mockStoryData.storyId;
    const categoryName = 'Fantasy';

    it('removes category from story successfully', async () => {
      const storyWithCategories = {
        ...mockStoryData,
        categoriesByCategoryId: [mockCategoryData, mockCategoryData2],
      };

      storyService.getStoryEntityById.mockResolvedValue(storyWithCategories);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue({
              ...storyWithCategories,
              categoriesByCategoryId: [mockCategoryData2],
            }),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.removeCategoryFromStory(userId, storyId, categoryName);

      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('handles removing category that does not exist on story', async () => {
      const storyWithCategories = {
        ...mockStoryData,
        categoriesByCategoryId: [mockCategoryData],
      };

      storyService.getStoryEntityById.mockResolvedValue(storyWithCategories);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithCategories),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.removeCategoryFromStory(userId, storyId, 'NonExistent');

      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('handles story with no categories', async () => {
      const storyWithoutCategories = {
        ...mockStoryData,
        categoriesByCategoryId: [],
      };

      storyService.getStoryEntityById.mockResolvedValue(storyWithoutCategories);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithoutCategories),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.removeCategoryFromStory(userId, storyId, categoryName);

      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('handles story with undefined categories array', async () => {
      const storyWithoutCategories = {
        ...mockStoryData,
        categoriesByCategoryId: undefined,
      };

      storyService.getStoryEntityById.mockResolvedValue(storyWithoutCategories as any);

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockTx = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(storyWithoutCategories),
          }),
        };
        return callback(mockTx);
      });

      await categoryService.removeCategoryFromStory(userId, storyId, categoryName);

      expect(storyService.getStoryEntityById).toHaveBeenCalledWith(storyId);
    });

    it('throws error if story not found', async () => {
      storyService.getStoryEntityById.mockRejectedValue(new Error('Story not found'));

      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        return callback({});
      });

      await expect(
        categoryService.removeCategoryFromStory(userId, storyId, categoryName),
      ).rejects.toThrow('Story not found');
    });
  });
});
