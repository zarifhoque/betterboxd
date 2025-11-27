import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Auth } from '../entities/Auth';
import { Story } from '../entities/Story';
import { ENV } from '../config/Env';
import { logger } from '../config/Logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT, 3000),
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Auth, Story],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    logger.info('Database connected successfully!');
  })
  .catch((err) => {
    logger.error('Database connection error:', err);
  });
