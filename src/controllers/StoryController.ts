// controllers/storyController.ts
import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/StoryService';
import { StoryResponseDTO } from '../dtos/StoryDTOs';
import {
  storyCreateSchema,
  storyUpdateSchema,
  StoryCreateSchemaType,
  StoryUpdateSchemaType,
} from '../schemas/StorySchema';

const storyService = new StoryService();

export class StoryController {
  static async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stories: StoryResponseDTO[] = await storyService.getAllStories();
      res.json({ success: true, data: stories });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      const story = await storyService.getStoryById(storyId);
      res.json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async createStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyData: StoryCreateSchemaType = storyCreateSchema.parse(req.body);
      const story: StoryResponseDTO = await storyService.createStory(storyData);
      res.status(201).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      const storyData: StoryUpdateSchemaType = storyUpdateSchema.parse(req.body);
      storyService.updateStory(storyId, storyData);
      res.json({ success: true, message: 'Story updated succesfully' });
    } catch (error) {
      next(error);
    }
  }
  static async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      await storyService.deleteStory(storyId);
      res.json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
