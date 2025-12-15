// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { plainToInstance } from 'class-transformer';
import { ErrorFactory } from '../errors/ErrorFactory';
import { StoryQueryType } from '../schemas/QuerySchema';
import { UserService } from './UserService';
import { logger } from '../config/Logger';
import { injectable } from 'tsyringe';
import { AppDataSource } from '../database/DataSource';
import { CategoryService } from './CategoryService';
import { generateSummary } from '../utils/AISummarization';
@injectable()
export class StoryService {
  constructor(
    private storyRepository: StoryRepository,
    private userService: UserService,
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

  // Create a new story with AI summary
  async createStory(story: StoryCreateDTO, userId: string): Promise<StoryResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw ErrorFactory.notFound(`User with the id ${userId} not found`);

    const createdStoryId = await AppDataSource.manager.transaction(async (tx) => {
      const summary = await generateSummary(story.body);

      const storyEntity = tx.getRepository(Story).create({
        ...story,
        userByUserId: { userId },
        aiSummary: summary,
      });

      const categories = await this.categoryService.ensureCategories(story.categoryNames);
      storyEntity.categoriesByCategoryId = categories;

      return (await tx.getRepository(Story).save(storyEntity)).storyId;
    });

    return plainToInstance(
      StoryResponseDTO,
      await this.storyRepository.getStoryById(createdStoryId),
      { excludeExtraneousValues: true },
    );
  }

  // Update story with AI summary update if body changes
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<StoryResponseDTO> {
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) throw ErrorFactory.notFound(`Story with the id ${storyId} not found`);

    const updatedStoryId = await AppDataSource.manager.transaction(async (tx) => {
      const summary =
        story.body && story.body !== existingStory.body
          ? await generateSummary(story.body)
          : existingStory.aiSummary;

      existingStory.title = story.title ?? existingStory.title;
      existingStory.body = story.body ?? existingStory.body;
      existingStory.aiSummary = summary;

      const categories = await this.categoryService.ensureCategories(story.categoryNames);
      existingStory.categoriesByCategoryId = categories;

      return (await tx.getRepository(Story).save(existingStory)).storyId;
    });

    return plainToInstance(
      StoryResponseDTO,
      await this.storyRepository.getStoryById(updatedStoryId),
      { excludeExtraneousValues: true },
    );
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

  async getStoryEntityById(storyId: string): Promise<Story> {
    const story = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw ErrorFactory.notFound(`Story with ID ${storyId} not found`);
    }
    return story;
  }
}
