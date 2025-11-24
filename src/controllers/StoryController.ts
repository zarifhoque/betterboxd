// controllers/storyController.ts
import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/StoryService';

const storyService = new StoryService();

export class StoryController {
  static async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stories = await storyService.getAllStories();
      res.json({ success: true, data: stories });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = Number(req.params.id);
      const story = await storyService.getStoryById(storyId);
      res.json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async createStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, title, body } = req.body;
      const story = await storyService.createStory(userId, title, body);
      res.status(201).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  static async updateStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = Number(req.params.id);
      const { title, body } = req.body;
      const story = await storyService.updateStory(storyId, title, body);
      res.json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }
  static async deleteStory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storyId = Number(req.params.id);
      await storyService.deleteStory(storyId);
      res.json({ success: true, message: 'Story deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
