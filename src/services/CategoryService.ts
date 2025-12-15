import { injectable } from 'tsyringe';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category } from '../entities/Category';
import { StoryService } from './StoryService';
import { AppDataSource } from '../database/DataSource';
import { Story } from '../entities/Story';
import { logger } from '../config/Logger';

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
      let category = await this.categoryRepo.findByName(name);
      if (!category) category = await this.categoryRepo.createCategory(name);
      categories.push(category);
    }
    return categories;
  }

  async listCategoriesByStoryId(storyId: string): Promise<string[]> {
    const story = await this.storyService.getStoryById(storyId);
    return story.categoryNames ?? [];
  }

  async addCategoryToStory(userId: string, storyId: string, categoryName: string): Promise<void> {
    logger.debug(`Adding category ${categoryName} to story ${storyId} by user ${userId}`);
    await AppDataSource.manager.transaction(async (tx) => {
      const [category] = await this.ensureCategories([categoryName]);
      const story = await this.storyService.getStoryEntityById(storyId);

      if (!story.categoriesByCategoryId?.some((c) => c.categoryId === category.categoryId)) {
        story.categoriesByCategoryId = [...(story.categoriesByCategoryId ?? []), category];
        await tx.getRepository(Story).save(story);
      }
    });
  }

  async removeCategoryFromStory(
    userId: string,
    storyId: string,
    categoryName: string,
  ): Promise<void> {
    await AppDataSource.manager.transaction(async (tx) => {
      const story = await this.storyService.getStoryEntityById(storyId);
      story.categoriesByCategoryId =
        story.categoriesByCategoryId?.filter((c) => c.name !== categoryName) ?? [];
      await tx.getRepository(Story).save(story);
    });
  }
}
