import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './database/DataSource';
import userRoutes from './routes/UserRoutes';
import storyRoutes from './routes/StoryRoutes';
import { errorHandler } from './middlewares/ErrorHandler';
import { logger } from './config/Logger';

AppDataSource.initialize()
  .then(() => {
    logger.info('Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization:', err);
  });

const app = express();

const PORT: number = parseInt(process.env.PORT || '3000', 10);
if (isNaN(PORT)) {
  throw new Error('Invalid PORT number');
}

app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stories', storyRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Movie Review API is running!');
});

app.use(errorHandler);

app
  .listen(PORT, (): void => {
    logger.info(`Server running on port ${PORT}`);
  })
  .on('error', (err: Error) => {
    logger.error('Server error:', err);
  });
