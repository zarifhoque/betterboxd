// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ErrorFactory } from '../errors/ErrorFactory';
import { StoryQueryType } from '../schemas/QuerySchema';
import { UserService } from './UserService';
import { logger } from '../config/Logger';
import { injectable } from 'tsyringe';
import { AppDataSource } from '../database/DataSource';
import { CategoryService } from './CategoryService';
@injectable()
export class StoryService {
  constructor(
    private storyRepository: StoryRepository,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  // Get all stories
  async getAllStories(queryParams: StoryQueryType): Promise<StoryResponseDTO[]> {
    const stories = await this.storyRepository.getAllStories(queryParams);
    return plainToInstance(StoryResponseDTO, stories, { excludeExtraneousValues: true });
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<StoryResponseDTO> {
    z.uuid().parse(storyId);
    const story = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw ErrorFactory.notFound(`Story with the id ${storyId} not found`);
    }
    return plainToInstance(StoryResponseDTO, story, { excludeExtraneousValues: true });
  }

  // Create a new story
  async createStory(story: StoryCreateDTO, userId: string): Promise<StoryResponseDTO> {
    const newStory = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const storyEntity = transactionalEntityManager.getRepository(Story).create({
        ...story,
        userByUserId: { userId },
      });

      const categories = await this.categoryService.ensureCategories(story.categoryNames);
      storyEntity.categoriesByCategoryId = categories;

      return transactionalEntityManager.getRepository(Story).save(storyEntity);
    });

    return plainToInstance(StoryResponseDTO, newStory, { excludeExtraneousValues: true });
  }

  // Update an existing story
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<StoryResponseDTO> {
    z.uuid().parse(storyId);
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      throw ErrorFactory.notFound(`Story with the id ${storyId} not found`);
    }
    const updatedStory = await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        existingStory.title = story.title ?? existingStory.title;
        existingStory.body = story.body ?? existingStory.body;

        const categories = await this.categoryService.ensureCategories(story.categoryNames);
        existingStory.categoriesByCategoryId = categories;
        return transactionalEntityManager.getRepository(Story).save(existingStory);
      },
    );
    return instanceToPlain(updatedStory) as StoryResponseDTO;
  }

  // Soft delete a story
  async deleteStory(storyId: string): Promise<void> {
    z.uuid().parse(storyId);
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      throw ErrorFactory.notFound(`Story with the id ${storyId} not found`);
    }

    const deleted = await this.storyRepository.softDeleteStory(storyId);
    if (!deleted) {
      throw ErrorFactory.conflict(`Failed to delete story with id ${storyId}`);
    }
  }

  async getOwnerId(storyId: string): Promise<string> {
    const userId = await this.storyRepository.getUserIdByStoryId(storyId);
    logger.debug(userId);
    if (!userId) {
      throw ErrorFactory.notFound(`Story with ID ${storyId} not found`);
    }
    return userId;
  }
}
