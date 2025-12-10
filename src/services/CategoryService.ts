import { injectable } from 'tsyringe';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { logger } from '../config/Logger';

@injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async seedCategories(names: string[]): Promise<void> {
    for (const name of names) {
      const exists = await this.categoryRepo.findByName(name);
      if (!exists) {
        await this.categoryRepo.createCategory(name);
      }
    }
  }
}
