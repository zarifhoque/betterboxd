import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { handleResponse } from '../utils/Response';
import { CategoryService } from '../services/CategoryService';
import { AuthRequest } from '../types/AuthTypes';

@autoInjectable()
export class TagController {
  constructor(private categoryService: CategoryService) {}

  list = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const tags = await this.categoryService.listCategoriesByStoryId(storyId);
    handleResponse(res, tags, { message: 'Tags retrieved successfully' });
  };

  addCategoryToStory = async (req: AuthRequest, res: Response) => {
    const { storyId } = req.params;
    const { tag } = req.body;
    const userId: string = req.user!.userId;

    await this.categoryService.addCategoryToStory(userId, storyId, tag);
    handleResponse(res, null, { message: 'Tag added successfully' });
  };

  removeTag = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const { tag } = req.body;

    await this.categoryService.removeTagFromStory(storyId, tag);
    handleResponse(res, null, { message: 'Tag removed successfully' });
  };
}
