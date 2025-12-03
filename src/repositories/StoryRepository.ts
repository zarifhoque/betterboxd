// repositories/StoryRepository.ts
import { STORY_FUZZY_THRESHOLDS } from '../constants/SearchConstants';
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

    const { title, author, createdAfter, createdBefore } = options;
    const whereParts: string[] = [];
    const parameters: Record<string, string | Date | number> = {};

    if (title) {
      whereParts.push('similarity(story.title, :title) > :titleThreshold');
      parameters.title = title;
      parameters.titleThreshold = STORY_FUZZY_THRESHOLDS.TITLE_THRESHOLD;
    }

    if (author) {
      whereParts.push('similarity(user.name, :author) > :authorThreshold');
      parameters.author = author;
      parameters.authorThreshold = STORY_FUZZY_THRESHOLDS.AUTHOR_THRESHOLD;
    }

    if (createdAfter) {
      whereParts.push('story.createdAt >= :createdAfter');
      parameters.createdAfter = new Date(createdAfter);
    }

    if (createdBefore) {
      whereParts.push('story.createdAt <= :createdBefore');
      parameters.createdBefore = new Date(createdBefore);
    }

    if (whereParts.length > 0) {
      query.andWhere(whereParts.join(' AND '), parameters);

      const orderExpressions: string[] = [];
      if (title) orderExpressions.push('similarity(story.title, :title)');
      if (author) orderExpressions.push('similarity(user.name, :author)');

      if (orderExpressions.length > 0) {
        query.orderBy(`GREATEST(${orderExpressions.join(', ')})`, 'DESC');
      }
    }

    return applyPagination(query, options, 'story').getMany();
  }

  // Get story by ID
  async getStoryById(storyId: string): Promise<Story | null> {
    return this.storyRepository.findOne({ where: { storyId }, relations: ['userByUserId'] });
  }

  // Get Stories by User ID
  async getStoriesByUserId(userId: string): Promise<Story[]> {
    return this.storyRepository.find({ where: { userByUserId: { userId } } });
  }

  // Create a new story
  async createStory(story: StoryCreateDTO, userId: string): Promise<Story> {
    const newStory = this.storyRepository.create({
      ...story,
      userByUserId: { userId: userId },
    });
    const saved = await this.storyRepository.save(newStory);
    return this.storyRepository.findOne({
      where: { storyId: saved.storyId },
      relations: ['userByUserId'],
    }) as Promise<Story>;
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
