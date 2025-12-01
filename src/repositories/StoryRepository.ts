// repositories/StoryRepository.ts
import { AppDataSource } from '../database/DataSource';
import { StoryCreateDTO, StoryUpdateDTO } from '../dtos/StoryDTOs';
import { Story } from '../entities/Story';
import { StoryQueryType } from '../schemas/QuerySchema';
import { applyPagination } from '../utils/Pagination';

export class StoryRepository {
  private storyRepository = AppDataSource.getRepository(Story);

  // Get all stories
  async getAllStories(options: StoryQueryType): Promise<Story[]> {
    const query = this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.userByUserId', 'user');

    const { title, author, createdAfter, createdBefore, fuzzy } = options;

    if (title) {
      if (fuzzy) {
        query.andWhere('story.title ILIKE :title', { title: `%${title}%` });
      } else {
        query.andWhere('story.title = :title', { title });
      }
    }

    if (author) {
      if (fuzzy) {
        query.andWhere('user.name ILIKE :author', { author: `%${author}%` });
      } else {
        query.andWhere('user.name = :author', { author });
      }
    }

    if (createdAfter) {
      query.andWhere('story.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('story.createdAt <= :createdBefore', { createdBefore });
    }

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
