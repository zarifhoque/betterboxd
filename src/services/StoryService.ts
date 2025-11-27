// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { plainToInstance } from 'class-transformer';
import { createError } from '../errors/ErrorFactory';
import { UserRepository } from '../repositories/UserRepository';
import { QueryParamsSchema } from '../schemas/QuerySchema';

export class StoryService {
  private storyRepository = new StoryRepository();
  private userRepository = new UserRepository();

  // Get all stories
  async getAllStories(paginationOptions: QueryParamsSchema): Promise<StoryResponseDTO[]> {
    const stories = await this.storyRepository.getAllStories(paginationOptions);
    return plainToInstance(StoryResponseDTO, stories);
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<StoryResponseDTO> {
    z.uuid().parse(storyId);
    const story = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }
    return plainToInstance(StoryResponseDTO, story);
  }

  // Get all stories by user ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    z.uuid().parse(userId);
    const stories = await this.storyRepository.getStoriesByUserId(userId);
    return stories;
  }

  // Create a new story
  async createStory(story: StoryCreateDTO): Promise<StoryResponseDTO> {
    const user = await this.userRepository.getUserById(story.userByUserId);
    if (!user) {
      throw createError('NotFound', `User with the id ${story.userByUserId} not found`);
    }
    const newStory = await this.storyRepository.createStory(story);
    return plainToInstance(StoryResponseDTO, newStory);
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
