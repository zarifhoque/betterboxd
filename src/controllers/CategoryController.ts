import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { handleResponse } from '../utils/Response';
import { CategoryService } from '../services/CategoryService';
import { AuthRequest } from '../types/AuthTypes';
import { logger } from '../config/Logger';

@autoInjectable()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  list = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const categories = await this.categoryService.listCategoriesByStoryId(storyId);
    handleResponse(res, categories, { message: 'Tags retrieved successfully' });
  };

  addCategoryToStory = async (req: AuthRequest, res: Response) => {
    const { storyId } = req.params;
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);
    const { category } = req.body;
    const userId: string = req.user!.userId;
    await this.categoryService.addCategoryToStory(userId, storyId, category);
    handleResponse(res, null, { message: 'Tag added successfully' });
  };

  removeTag = async (req: AuthRequest, res: Response) => {
    const { storyId } = req.params;
    const { category } = req.body;
    const userId: string = req.user!.userId;

    await this.categoryService.removeCategoryFromStory(userId, storyId, category);
    handleResponse(res, null, { message: 'Tag removed successfully' });
  };
}
