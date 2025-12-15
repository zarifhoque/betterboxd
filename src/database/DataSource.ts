import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Auth } from '../entities/Auth';
import { Story } from '../entities/Story';
import { ENV } from '../config/Env';
import { EnablePgTrgmAndIndexes1764659135094 } from '../migration/1764659135094-TogglePgTrgmExtension';
import { Category } from '../entities/Category';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: parseInt(ENV.DB_PORT, 3000),
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Auth, Story, Category],
  migrations: [EnablePgTrgmAndIndexes1764659135094],
  subscribers: [],
});
