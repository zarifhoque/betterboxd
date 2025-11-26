// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { z } from 'zod';
import { StoryCreateDTO, StoryResponseDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { toStoryResponseDTO, toStoryResponseDTOs } from '../utils/utils';
import { createError } from '../errors/ErrorFactory';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class StoryService {
  private storyRepository = new StoryRepository();
  private userRepository = new UserRepository();

  // Get all stories
  async getAllStories(): Promise<StoryResponseDTO[]> {
    const stories: Story[] = await this.storyRepository.getAllStories();
    return toStoryResponseDTOs(stories);
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<StoryResponseDTO> {
    z.uuid().parse(storyId);
    const story: Story | null = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }
    return toStoryResponseDTO(story);
  }

  // Get all stories by user ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    z.uuid().parse(userId);
    const stories: Story[] = await this.storyRepository.getStoriesByUserId(userId);
    return stories;
  }

  // Create a new story
  async createStory(story: StoryCreateDTO): Promise<StoryResponseDTO> {
    const user: User | null = await this.userRepository.getUserById(story.userByUserId);
    if (!user) {
      throw createError('NotFound', `User with the id ${story.userByUserId} not found`);
    }
    const newStory = await this.storyRepository.createStory(story);
    const newStoryResponse = toStoryResponseDTO(newStory);
    return newStoryResponse;
  }

  // Update an existing story
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<void> {
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      throw createError('NotFound', `Story with the id ${storyId} not found`);
    }

    const updatedState: boolean = await this.storyRepository.updateStory(storyId, story);
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
