// controllers/storyController.ts
import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/StoryService';
import { StoryUpdateDTO } from '../dtos/StoryDTOs';
import z from 'zod';
import { StoryQueryType } from '../schemas/QuerySchema';
import { AuthRequest } from '../types/AuthTypes';
import { logger } from '../config/Logger';

const storyService = new StoryService();

export class StoryController {
  static async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as StoryQueryType;
      const stories = await storyService.getAllStories(queryParams);
      res.json({ success: true, data: stories, message: 'Stories fetched successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      const story = await storyService.getStoryById(storyId);
      res.json({ success: true, data: story, message: 'Story fetched successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createStory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.user!.userId;
      const story = await storyService.createStory(req.body, userId);
      res.status(201).json({ success: true, data: story, message: 'Story created successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      const storyData: StoryUpdateDTO = req.body;
      await storyService.updateStory(storyId, storyData);
      res.status(204).json({ success: true, message: 'Story updated succesfully' });
    } catch (error) {
      next(error);
    }
  }
  static async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      z.uuid().parse(storyId);
      await storyService.deleteStory(storyId);
      res.status(204).json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
