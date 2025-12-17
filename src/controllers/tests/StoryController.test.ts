import 'reflect-metadata';

// Mock AISummarization BEFORE other imports
jest.mock('../../utils/AISummarization', () => ({
  generateSummary: jest.fn(),
}));

import { Request, Response, NextFunction } from 'express';
import { StoryController } from '../StoryController';
import { StoryService } from '../../services/StoryService';
import { StoryCreateDTO, StoryUpdateDTO, StoryResponseDTO } from '../../dtos/StoryDTOs';
import { AuthRequest } from '../../types/AuthTypes';
import { UserRole } from '../../entities/User';
import { handleResponse } from '../../utils/Response';
import {
  mockStoryData,
  mockStoriesArray,
  storyCreateDTOData,
  storyUpdateDTOData,
  mockUserData,
  mockStoryResponseDTO,
} from '../../__mocks__/data/Story';

jest.mock('../../services/StoryService');
jest.mock('../../utils/Response');

describe('StoryController', () => {
  let storyController: StoryController;
  let storyService: jest.Mocked<StoryService>;
  let mockRequest: Partial<Request>;
  let mockAuthRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    storyService = new StoryService({} as any, {} as any) as jest.Mocked<StoryService>;
    storyController = new StoryController(storyService);

    mockRequest = {
      params: {},
      query: {} as any,
      body: {},
    };

    mockAuthRequest = {
      params: {},
      query: {} as any,
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

  describe('getAllStories', () => {
    it('should fetch all stories successfully', async () => {
      const queryParams = { page: 1, itemsPerPage: 10 };
      mockRequest.query = queryParams as any;
      storyService.getAllStories.mockResolvedValue(
        mockStoriesArray.map((s) => mockStoryResponseDTO),
      );

      await storyController.getAllStories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.getAllStories).toHaveBeenCalledWith(queryParams);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        expect.any(Array),
        expect.objectContaining({
          status: 200,
          message: 'Stories fetched successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty array when no stories found', async () => {
      const queryParams = { page: 1, itemsPerPage: 10 };
      mockRequest.query = queryParams as any;
      storyService.getAllStories.mockResolvedValue([]);

      await storyController.getAllStories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.getAllStories).toHaveBeenCalledWith(queryParams);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        [],
        expect.objectContaining({
          status: 200,
          message: 'Stories fetched successfully',
        }),
      );
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Database error');
      storyService.getAllStories.mockRejectedValue(error);

      await storyController.getAllStories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should handle query parameters with filters', async () => {
      const queryParams = { page: 1, itemsPerPage: 10, title: 'Adventure', author: 'Teller' };
      mockRequest.query = queryParams as any;
      storyService.getAllStories.mockResolvedValue([mockStoryResponseDTO]);

      await storyController.getAllStories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.getAllStories).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('getStoryById', () => {
    const storyId = '550e8400-e29b-41d4-a716-446655440010';

    it('should fetch story by id successfully', async () => {
      mockRequest.params = { id: storyId };
      storyService.getStoryById.mockResolvedValue(mockStoryResponseDTO);

      await storyController.getStoryById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.getStoryById).toHaveBeenCalledWith(storyId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockStoryResponseDTO,
        expect.objectContaining({
          status: 200,
          message: 'Story fetched successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };

      await storyController.getStoryById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(storyService.getStoryById).not.toHaveBeenCalled();
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if story not found', async () => {
      mockRequest.params = { id: storyId };
      const error = new Error('Story not found');
      storyService.getStoryById.mockRejectedValue(error);

      await storyController.getStoryById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.getStoryById).toHaveBeenCalledWith(storyId);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });
  });

  describe('createStory', () => {
    const userId = '555e4567-e89b-12d3-a456-426614174000';
    const createData: StoryCreateDTO = storyCreateDTOData;

    it('should create story successfully', async () => {
      mockAuthRequest.body = createData;
      storyService.createStory.mockResolvedValue(mockStoryResponseDTO);

      await storyController.createStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.createStory).toHaveBeenCalledWith(createData, userId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockStoryResponseDTO,
        expect.objectContaining({
          status: 201,
          message: 'Story created successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if user not found', async () => {
      mockAuthRequest.body = createData;
      const error = new Error('User not found');
      storyService.createStory.mockRejectedValue(error);

      await storyController.createStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if story creation fails', async () => {
      mockAuthRequest.body = createData;
      const error = new Error('Failed to create story');
      storyService.createStory.mockRejectedValue(error);

      await storyController.createStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should create story with AI summary', async () => {
      mockAuthRequest.body = createData;
      const storyWithSummary = {
        ...mockStoryResponseDTO,
        aiSummary: 'AI generated summary',
      };
      storyService.createStory.mockResolvedValue(storyWithSummary);

      await storyController.createStory(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(storyService.createStory).toHaveBeenCalledWith(createData, userId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        storyWithSummary,
        expect.objectContaining({
          status: 201,
        }),
      );
    });
  });

  describe('updateStory', () => {
    const storyId = '550e8400-e29b-41d4-a716-446655440010';
    const updateData: StoryUpdateDTO = storyUpdateDTOData;

    it('should update story successfully', async () => {
      mockRequest.params = { id: storyId };
      mockRequest.body = updateData;
      const updatedStory = { ...mockStoryResponseDTO, ...updateData };
      storyService.updateStory.mockResolvedValue(updatedStory);

      await storyController.updateStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(storyService.updateStory).toHaveBeenCalledWith(storyId, updateData);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        updatedStory,
        expect.objectContaining({
          status: 200,
          message: 'Story updated successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };
      mockRequest.body = updateData;

      await storyController.updateStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(storyService.updateStory).not.toHaveBeenCalled();
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if story not found', async () => {
      mockRequest.params = { id: storyId };
      mockRequest.body = updateData;
      const error = new Error('Story not found');
      storyService.updateStory.mockRejectedValue(error);

      await storyController.updateStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should update only title', async () => {
      mockRequest.params = { id: storyId };
      mockRequest.body = { title: 'New Title Only' };
      const updatedStory = { ...mockStoryResponseDTO, title: 'New Title Only' };
      storyService.updateStory.mockResolvedValue(updatedStory);

      await storyController.updateStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(storyService.updateStory).toHaveBeenCalledWith(storyId, { title: 'New Title Only' });
    });

    it('should update only body and regenerate AI summary', async () => {
      mockRequest.params = { id: storyId };
      mockRequest.body = { body: 'New body content' };
      const updatedStory = {
        ...mockStoryResponseDTO,
        body: 'New body content',
        aiSummary: 'New AI summary',
      };
      storyService.updateStory.mockResolvedValue(updatedStory);

      await storyController.updateStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(storyService.updateStory).toHaveBeenCalledWith(storyId, { body: 'New body content' });
    });
  });

  describe('deleteStory', () => {
    const storyId = '550e8400-e29b-41d4-a716-446655440010';

    it('should delete story successfully', async () => {
      mockRequest.params = { id: storyId };
      storyService.deleteStory.mockResolvedValue(undefined);

      await storyController.deleteStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(storyService.deleteStory).toHaveBeenCalledWith(storyId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        null,
        expect.objectContaining({
          status: 200,
          message: 'Story deleted successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };

      await storyController.deleteStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(storyService.deleteStory).not.toHaveBeenCalled();
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if story not found', async () => {
      mockRequest.params = { id: storyId };
      const error = new Error('Story not found');
      storyService.deleteStory.mockRejectedValue(error);

      await storyController.deleteStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(storyService.deleteStory).toHaveBeenCalledWith(storyId);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if deletion fails', async () => {
      mockRequest.params = { id: storyId };
      const error = new Error('Failed to delete story');
      storyService.deleteStory.mockRejectedValue(error);

      await storyController.deleteStory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
