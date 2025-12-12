// src/controllers/TagController.ts
import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { TagService } from '../services/TagService';
import { handleResponse } from '../utils/Response';

@autoInjectable()
export class TagController {
  constructor(private tagService: TagService) {}

  list = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const tags = await this.tagService.listTagsByStoryId(storyId);
    handleResponse(res, tags, { message: 'Tags retrieved successfully' });
  };

  addTag = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const { tag } = req.body;

    await this.tagService!.addTagToStory(storyId, tag);
    res.json({ message: 'Tag added' });
  };

  removeTag = async (req: Request, res: Response) => {
    const { storyId } = req.params;
    const { tag } = req.body;

    await this.tagService!.removeTagFromStory(storyId, tag);
    res.json({ message: 'Tag removed' });
  };
}
