import 'reflect-metadata';
import { container } from 'tsyringe';
import { CategoryService } from '../services/CategoryService';
import { logger } from '../config/Logger';
import { AppDataSource } from '../database/DataSource';

const categories = ['Technology', 'Science', 'Art', 'Health'];

const seedCategories = async () => {
  logger.debug('This is being reached');
  try {
    await AppDataSource.initialize();
    const categoryService = container.resolve(CategoryService);
    await categoryService.seedCategories(categories);
    logger.info('Seeding succesful!');
    await AppDataSource.destroy();
  } catch (error) {
    logger.error('Seeding failed', error);
  }
};

seedCategories();
