// src/repositories/TagRepository.ts
import { injectable } from 'tsyringe';
import { AppDataSource } from '../config/data-source';
import { Tag } from '../entities/Tag';

@injectable()
export class TagRepository {
  private repo = AppDataSource.getRepository(Tag);

  findAll(): Promise<Tag[]> {
    return this.repo.find();
  }

  findByName(name: string): Promise<Tag | null> {
    return this.repo.findOne({ where: { name } });
  }

  createTag(name: string): Promise<Tag> {
    return this.repo.save(this.repo.create({ name }));
  }

  findById(tagId: string): Promise<Tag | null> {
    return this.repo.findOne({ where: { tagId } });
  }
}
