// src/services/TagService.ts
import { injectable } from 'tsyringe';
import { TagRepository } from '../repositories/TagRepository';
import { StoryRepository } from '../repositories/StoryRepository';
import { Tag } from '../entities/Tag';
import { ErrorFactory } from '../errors/ErrorFactory';


@injectable()
export class TagService {
  constructor(
    private tagRepo: TagRepository,
    private storyRepo: StoryRepository,
  ) {}

  async listTags(): Promise<Tag[]> {
    return this.tagRepo.findAll();
  }

  async addTagToStory(storyId: string, tagName: string): Promise<void> {
    const story = await this.storyRepo.getStoryById(storyId);
    if (!story) throw ErrorFactory.notFound('Story not found');

    let tag = await this.tagRepo.findByName(tagName);
    if (!tag) {
      tag = await this.tagRepo.createTag(tagName);
    }

    story.tags = story.tags ? [...story.tags, tag] : [tag];
    await this.storyRepo.save(story);
  }

  async removeTagFromStory(storyId: string, tagName: string): Promise<void> {
    const story = await this.storyRepo.getStoryById(storyId, ['tags']);
    if (!story) throw ErrorFactory.notFound('Story not found');

    story.tags = story.tags.filter((t) => t.name !== tagName);
    await this.storyRepo.save(story);
  }
}
