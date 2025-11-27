// repositories/StoryRepository.ts
import { AppDataSource } from '../database/DataSource';
import { StoryCreateDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { Story } from '../entities/Story';
import { QueryParamsSchema } from '../schemas/QuerySchema';
import { applyPagination } from '../utils/Pagination';

export class StoryRepository {
  private storyRepository = AppDataSource.getRepository(Story);

  // Get all stories
  async getAllStories(options: QueryParamsSchema = {}): Promise<Story[]> {
    const query = this.storyRepository.createQueryBuilder('story');
    return applyPagination(query, options, 'story').getMany();
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<Story | null> {
    return this.storyRepository.findOne({ where: { storyId } });
  }

  // Get Stories by User ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    return this.storyRepository.find({ where: { userByUserId: { userId } } });
  }

  // Create a new story
  async createStory(story: StoryCreateDTO): Promise<Story> {
    const newStory = this.storyRepository.create({
      ...story,
      userByUserId: { userId: story.userByUserId },
    });
    return this.storyRepository.save(newStory);
  }

  // Update an existing story
  async updateStory(storyId: string, story: StoryUpdateDTO): Promise<boolean> {
    const result = await this.storyRepository.update(storyId, story);
    return (result.affected ?? 0) > 0;
  }

  // Soft delete a story
  async softDeleteStory(storyId: string): Promise<boolean> {
    const result = await this.storyRepository.softDelete(storyId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }
}
