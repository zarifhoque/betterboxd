// services/StoryService.ts
import { StoryRepository } from '../repositories/StoryRepository';
import { Story } from '../entities/Story';
import { NotFoundError, ConflictError } from '../errors/AppErrors';
import { z } from 'zod';

export class StoryService {
  private storyRepository = new StoryRepository();

  // Get all stories
  async getAllStories(): Promise<Story[]> {
    // return this.storyRepository.getAllStories();
    const stories: Story[] = await this.storyRepository.getAllStories();
    return stories;
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<Story> {
    z.uuid().parse(storyId);
    const story: Story | null = await this.storyRepository.getStoryById(storyId);
    if (!story) {
      throw new NotFoundError(`Story with the id ${storyId} not found`);
    }
    return story;
  }

  // Get all stories by user ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    z.uuid().parse(userId);
    const stories: Story[] = await this.storyRepository.getStoriesByUserId(userId);
    return stories;
  }

  // Create a new story
  async createStory(story: Story): Promise<Story> {
    const 
    return this.storyRepository.createStory(story);
  }

  // Update an existing story
  async updateStory(story: Story): Promise<void> {
    const existingStory = await this.storyRepository.getStoryById(story.storyId.toString());
    if (!existingStory) {
      throw new NotFoundError(`Story with the id ${story.storyId} not found`);
    }

    const updated = await this.storyRepository.updateStory(story);
    if (!updated) {
      throw new ConflictError(`Failed to update story with id ${story.storyId}`);
    }
  }

  // Soft delete a story
  async deleteStory(storyId: string): Promise<void> {
    z.string().parse(storyId);
    const existingStory = await this.storyRepository.getStoryById(storyId);
    if (!existingStory) {
      throw new NotFoundError(`Story with the id ${storyId} not found`);
    }

    const deleted = await this.storyRepository.softDeleteStory(Number(storyId));
    if (!deleted) {
      throw new ConflictError(`Failed to delete story with id ${storyId}`);
    }
  }
}
