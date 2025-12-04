// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { plainToInstance } from 'class-transformer';
import { createError } from '../errors/ErrorFactory';
import { StoryQueryType } from '../schemas/QuerySchema';
import { UserService } from './UserService';
import { logger } from '../config/Logger';

export class StoryService {
  private storyRepository = new StoryRepository();
  private userService = new UserService();

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
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }
    return plainToInstance(StoryResponseDTO, story, { excludeExtraneousValues: true });
  }

  // Get all stories by user ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    z.uuid().parse(userId);
    const stories = await this.storyRepository.getStoriesByUserId(userId);
    return stories;
  }

  // Create a new story
  async createStory(story: StoryCreateDTO, userId: string): Promise<StoryResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw createError('NotFound', `User with the id ${userId} not found`);
    }
    const newStory = await this.storyRepository.createStory(story, userId);
    return plainToInstance(StoryResponseDTO, newStory, { excludeExtraneousValues: true });
  }

  // Update an existing story
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<void> {
    logger.debug(typeof storyId);
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      // logger.debug('We are not');
      // logger.debug(storyId);
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }

    const updatedState = await this.storyRepository.updateStory(storyId, story);
    if (!updatedState) {
      throw createError('Conflict', `Failed to update story with id ${storyId}`);
    }
  }

  // Soft delete a story
  async deleteStory(storyId: string): Promise<void> {
    z.uuid().parse(storyId);
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }

    const deleted = await this.storyRepository.softDeleteStory(storyId);
    if (!deleted) {
      throw createError('Conflict', `Failed to delete story with id ${storyId}`);
    }
  }

  async getOwnerId(storyId: string): Promise<string> {
    const userId = await this.storyRepository.getUserIdByStoryId(storyId);
    logger.debug(userId);
    if (!userId) {
      throw createError('NotFound', `Story with ID ${storyId} not found`);
    }
    return userId;
  }
}
