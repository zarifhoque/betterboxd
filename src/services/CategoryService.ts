import { injectable } from 'tsyringe';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Category } from '../entities/Category';

@injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async ensureCategories(categoryNames?: string[]): Promise<Category[]> {
    if (!categoryNames || categoryNames.length === 0) return [];

    const categories: Category[] = [];

    for (const name of categoryNames) {
      let category = await this.categoryRepo.findByName(name);
      if (!category) {
        category = await this.categoryRepo.createCategory(name);
      }
      categories.push(category);
    }

    return categories;
  }
}
