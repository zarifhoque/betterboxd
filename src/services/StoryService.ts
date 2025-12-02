// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponse, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { createError } from '../errors/ErrorFactory';
import { StoryQueryType } from '../schemas/QuerySchema';
import { UserService } from './UserService';

export class StoryService {
  private storyRepository = new StoryRepository();
  private userService = new UserService();

  // Get all stories
  async getAllStories(queryParams: StoryQueryType): Promise<StoryResponse[]> {
    const stories = await this.storyRepository.getAllStories(queryParams);
    return plainToInstance(StoryResponse, stories, { excludeExtraneousValues: true });
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<StoryResponse> {
    z.uuid().parse(storyId);
    const story = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }
    return plainToInstance(StoryResponse, story, { excludeExtraneousValues: true });
  }

  // Get all stories by user ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    z.uuid().parse(userId);
    const stories = await this.storyRepository.getStoriesByUserId(userId);
    return stories;
  }

  // Create a new story
  async createStory(story: StoryCreateDTO): Promise<StoryResponse> {
    const user = await this.userService.getUserById(story.userByUserId);
    if (!user) {
      throw createError('NotFound', `User with the id ${story.userByUserId} not found`);
    }
    const newStory = await this.storyRepository.createStory(story);
    return plainToInstance(StoryResponse, newStory, { excludeExtraneousValues: true });
  }

  // Update an existing story
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<void> {
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
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
}
