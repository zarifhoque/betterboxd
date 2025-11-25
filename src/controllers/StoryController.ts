// controllers/storyController.ts
import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/StoryService';
import { StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';

const storyService = new StoryService();

export class StoryController {
  static async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stories: StoryResponseDTO[] = await storyService.getAllStories();
      res.json({ success: true, data: stories, message: 'Stories fetched successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      const story = await storyService.getStoryById(storyId);
      res.json({ success: true, data: story, message: 'Story fetched successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async createStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const story: StoryResponseDTO = await storyService.createStory(req.body);
      res.status(201).json({ success: true, data: story, message: 'Story created successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = req.params.id;
      const storyData: StoryUpdateDTO = req.body;
      await storyService.updateStory(storyId, storyData);
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
