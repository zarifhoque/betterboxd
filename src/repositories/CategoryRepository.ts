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

  async findById(categoryId: string): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { categoryId } });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }
}
