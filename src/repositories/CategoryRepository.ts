import { injectable } from 'tsyringe';
import { AppDataSource } from '../database/DataSource';
import { Category } from '../entities/Category';

@injectable()
export class CategoryRepository {
  private categoryRepo = AppDataSource.getRepository(Category);

  async createCategory(name: string): Promise<Category> {
    const category = this.categoryRepo.create({ name });
    return this.categoryRepo.save(category);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { name } });
  }

  async createTag(name: string): Promise<Tag> {
    const tag = this.tagRepo.create({ name });
    return this.tagRepo.save(tag);
  }

  async findTagByName(name: string): Promise<Tag | null> {
    return this.tagRepo.findOne({ where: { name } });
  }

  async findTagById(tagId: string): Promise<Tag | null> {
    return this.tagRepo.findOne({ where: { tagId } });
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepo.find();
  }
}
