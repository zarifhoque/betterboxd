// repositories/StoryRepository.ts
import { AppDataSource } from '../database/DataSource';
import { Story } from '../entities/Story';

export class StoryRepository {
  private storyRepository = AppDataSource.getRepository(Story);

  // Get all stories
  async getAllStories(): Promise<Story[]> {
    return this.storyRepository.find({ relations: ['user'] });
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<Story | null> {
    return this.storyRepository.findOne({ where: { storyId }, relations: ['user'] });
  }

  // Get Stories by User ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    return this.storyRepository.find({ where: { userByUserId: { userId } }, relations: ['user'] });
  }

  // Create a new story
  async createStory(story: Story): Promise<Story> {
    const newStory = this.storyRepository.create(story);
    return this.storyRepository.save(newStory);
  }

  // Update an existing story
  async updateStory(story: Story): Promise<boolean> {
    const result = await this.storyRepository.update(story.storyId, story);
    return (result.affected ?? 0) > 0;
  }

  // Soft delete a story
  async softDeleteStory(storyId: number): Promise<boolean> {
    const result = await this.storyRepository.softDelete(storyId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }
}
