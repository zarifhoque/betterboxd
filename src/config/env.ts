import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from './Logger';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  // JWT
  JWT_SECRET: z.string(),
  // Bcrypt
  SALT_ROUNDS: z.coerce
    .number()
    .int()
    .min(1, 'Minimum number of rounds of schema validation must be 10')
    .default(10),
  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .default(false),
  SMTP_USER: z.string().default('your_mailtrap_user'),
  SMTP_PASS: z.string().default('your_mailtrap_pass'),

  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

export const ENV = EnvSchema.parse(process.env);
logger.debug('The environment variables are ' + ENV);

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
export const isTest = ENV.NODE_ENV === 'test';
