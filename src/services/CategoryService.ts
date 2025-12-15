import { injectable } from 'tsyringe';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category } from '../entities/Category';
import { ErrorFactory } from '../errors/ErrorFactory';
import { StoryService } from './StoryService';

@injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private storyService: StoryService,
  ) {}

  async ensureCategories(names?: string[]): Promise<Category[]> {
    if (!names || names.length === 0) return [];
    const categories: Category[] = [];
    for (const name of names) {
      const normalized = name.trim().toLowerCase();
      let category = await this.categoryRepo.findByName(normalized);
      if (!category) category = await this.categoryRepo.createCategory(normalized);
      categories.push(category);
    }
    return categories;
  }

  async listCategoriesByStoryId(storyId: string): Promise<string[]> {
    const story = await this.storyService.getStoryById(storyId);
    if (!story) throw ErrorFactory.notFound('Story not found');
    return story.categoryNames ?? [];
  }

  async addCategoryToStory(userId: string, storyId: string, categoryName: string): Promise<void> {
    const story = await this.storyService.getStoryById(storyId);

    let category = await this.categoryRepo.findByName(categoryName);
    if (!category) {
      category = await this.categoryRepo.createCategory(categoryName);
    }

    const exists = story.categoryNames?.some((category) => category === categoryName);
    if (!exists) {
      story.categoryNames = story.categoryNames ? [...story.categoryNames, category] : [category];
      await this.storyService.updateStory(userId, story);
    }
  }

  async removeTagFromStory(storyId: string, tagName: string): Promise<void> {
    const story = await this.storyRepo.getStoryById(storyId, ['tags']);
    if (!story) throw ErrorFactory.notFound('Story not found');

    const normalized = tagName.trim().toLowerCase();
    story.tags = story.tags.filter((t) => t.name !== normalized);
    await this.storyRepo.save(story);
  }
}
