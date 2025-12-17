import 'reflect-metadata';

// Mock AISummarization BEFORE other imports
jest.mock('../../utils/AISummarization', () => ({
  generateSummary: jest.fn(),
}));

import { Request, Response, NextFunction } from 'express';
import { CategoryController } from '../CategoryController';
import { CategoryService } from '../../services/CategoryService';
import { AuthRequest } from '../../types/AuthTypes';
import { UserRole } from '../../entities/User';
import { handleResponse } from '../../utils/Response';
import { mockStoryData, mockUserData } from '../../__mocks__/data/Story';
import { mockCategoryData } from '../../__mocks__/data/Category';

jest.mock('../../services/CategoryService');
jest.mock('../../utils/Response');

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: jest.Mocked<CategoryService>;
  let mockRequest: Partial<Request>;
  let mockAuthRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    categoryService = new CategoryService({} as any, {} as any) as jest.Mocked<CategoryService>;
    categoryController = new CategoryController(categoryService);

    mockRequest = {
      params: {},
      body: {},
    };

    mockAuthRequest = {
      params: {},
      body: {},
      user: {
        userId: '555e4567-e89b-12d3-a456-426614174000',
        role: UserRole.USER,
        pwdlmod: Date.now(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('list', () => {
    const storyId = mockStoryData.storyId;

    it('should list categories for a story successfully', async () => {
      mockRequest.params = { storyId };
      const categoryNames = ['Fantasy', 'Adventure'];
      categoryService.listCategoriesByStoryId.mockResolvedValue(categoryNames);

      await categoryController.list(mockRequest as Request, mockResponse as Response, mockNext);

      expect(categoryService.listCategoriesByStoryId).toHaveBeenCalledWith(storyId);
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, categoryNames, {
        message: 'Tags retrieved successfully',
      });
    });

    it('should return empty array when story has no categories', async () => {
      mockRequest.params = { storyId };
      categoryService.listCategoriesByStoryId.mockResolvedValue([]);

      await categoryController.list(mockRequest as Request, mockResponse as Response, mockNext);

      expect(categoryService.listCategoriesByStoryId).toHaveBeenCalledWith(storyId);
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, [], {
        message: 'Tags retrieved successfully',
      });
    });

    it('should throw error if story not found', async () => {
      mockRequest.params = { storyId };
      const error = new Error('Story not found');
      categoryService.listCategoriesByStoryId.mockRejectedValue(error);

      await categoryController.list(mockRequest as Request, mockResponse as Response, mockNext);

      expect(categoryService.listCategoriesByStoryId).toHaveBeenCalledWith(storyId);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should throw error for invalid storyId', async () => {
      mockRequest.params = { storyId: 'invalid-id' };
      const error = new Error('Invalid UUID');
      categoryService.listCategoriesByStoryId.mockRejectedValue(error);

      await categoryController.list(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should handle multiple categories', async () => {
      mockRequest.params = { storyId };
      const categoryNames = ['Fantasy', 'Adventure', 'Mystery', 'SciFi'];
      categoryService.listCategoriesByStoryId.mockResolvedValue(categoryNames);

      await categoryController.list(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handleResponse).toHaveBeenCalledWith(mockResponse, categoryNames, {
        message: 'Tags retrieved successfully',
      });
    });
  });

  describe('addCategoryToStory', () => {
    const storyId = mockStoryData.storyId;
    const userId = mockUserData.userId;
    const categoryName = 'Fantasy';

    it('should add category to story successfully', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: categoryName };
      categoryService.addCategoryToStory.mockResolvedValue(undefined);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.addCategoryToStory).toHaveBeenCalledWith(
        userId,
        storyId,
        categoryName,
      );
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        message: 'Tag added successfully',
      });
    });

    it('should add new category that does not exist', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: 'NewCategory' };
      categoryService.addCategoryToStory.mockResolvedValue(undefined);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.addCategoryToStory).toHaveBeenCalledWith(
        userId,
        storyId,
        'NewCategory',
      );
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        message: 'Tag added successfully',
      });
    });

    it('should not add duplicate category', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: categoryName };
      // Service handles idempotency, returns without error
      categoryService.addCategoryToStory.mockResolvedValue(undefined);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.addCategoryToStory).toHaveBeenCalledWith(
        userId,
        storyId,
        categoryName,
      );
      expect(handleResponse).toHaveBeenCalled();
    });

    it('should throw error if story not found', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: categoryName };
      const error = new Error('Story not found');
      categoryService.addCategoryToStory.mockRejectedValue(error);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should throw error if category name is missing', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = {}; // No category
      const error = new Error('Category name is required');
      categoryService.addCategoryToStory.mockRejectedValue(error);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should throw error for invalid storyId', async () => {
      mockAuthRequest.params = { storyId: 'invalid-id' };
      mockAuthRequest.body = { category: categoryName };
      const error = new Error('Invalid UUID');
      categoryService.addCategoryToStory.mockRejectedValue(error);

      await categoryController.addCategoryToStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });
  });

  describe('removeTag', () => {
    const storyId = mockStoryData.storyId;
    const userId = mockUserData.userId;
    const categoryName = 'Fantasy';

    it('should remove category from story successfully', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: categoryName };
      categoryService.removeCategoryFromStory.mockResolvedValue(undefined);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.removeCategoryFromStory).toHaveBeenCalledWith(
        userId,
        storyId,
        categoryName,
      );
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        message: 'Tag removed successfully',
      });
    });

    it('should handle removing non-existent category', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: 'NonExistent' };
      // Service handles this gracefully
      categoryService.removeCategoryFromStory.mockResolvedValue(undefined);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.removeCategoryFromStory).toHaveBeenCalledWith(
        userId,
        storyId,
        'NonExistent',
      );
      expect(handleResponse).toHaveBeenCalled();
    });

    it('should throw error if story not found', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: categoryName };
      const error = new Error('Story not found');
      categoryService.removeCategoryFromStory.mockRejectedValue(error);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.removeCategoryFromStory).toHaveBeenCalledWith(
        userId,
        storyId,
        categoryName,
      );
      expect(mockNext).toHaveBeenCalledWith(error);

      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should throw error if category name is missing', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = {}; // No category
      const error = new Error('Category name is required');
      categoryService.removeCategoryFromStory.mockRejectedValue(error);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should throw error for invalid storyId', async () => {
      mockAuthRequest.params = { storyId: 'invalid-id' };
      mockAuthRequest.body = { category: categoryName };
      const error = new Error('Invalid UUID');
      categoryService.removeCategoryFromStory.mockRejectedValue(error);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should remove category from story with multiple categories', async () => {
      mockAuthRequest.params = { storyId };
      mockAuthRequest.body = { category: 'Adventure' };
      categoryService.removeCategoryFromStory.mockResolvedValue(undefined);

      await categoryController.removeTag(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(categoryService.removeCategoryFromStory).toHaveBeenCalledWith(
        userId,
        storyId,
        'Adventure',
      );
      expect(handleResponse).toHaveBeenCalled();
    });
  });
});
