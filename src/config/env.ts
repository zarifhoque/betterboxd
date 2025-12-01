import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  SALT_ROUNDS: z.coerce
    .number()
    .int()
    .min(1, 'Minimum number of rounds of schema validation must be 10')
    .default(10),
});

export const ENV = EnvSchema.parse(process.env);

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
export const isTest = ENV.NODE_ENV === 'test';
