// controllers/storyController.ts
import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/StoryService';
import { StoryUpdateDTO } from '../dtos/StoryDTOs';
import z from 'zod';
import { StoryQueryType } from '../schemas/QuerySchema';
import { AuthRequest } from '../types/AuthTypes';
import { ERROR_DEFINITIONS } from '../constants/HTTPConstants';
import { handleResponse } from '../utils/Response';
import { injectable } from 'tsyringe';

@injectable()
export class StoryController {
  constructor(private storyService: StoryService) {}
  async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as StoryQueryType;
      const stories = await this.storyService.getAllStories(queryParams);
      handleResponse(res, stories, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'Stories fetched successfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      const story = await this.storyService.getStoryById(storyId);
      handleResponse(res, story, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'Story fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createStory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.user!.userId;
      const story = await this.storyService.createStory(req.body, userId);
      handleResponse(res, story, {
        status: ERROR_DEFINITIONS.CREATED.status,
        message: 'Story created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      const storyData: StoryUpdateDTO = req.body;
      const updatedStory = await this.storyService.updateStory(storyId, storyData);
      handleResponse(res, updatedStory, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'Story updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      await this.storyService.deleteStory(storyId);
      handleResponse(res, null, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'Story deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
