import { logger } from './config/Logger';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { AppDataSource } from './database/DataSource';
import userRoutes from './routes/UserRoutes';
import storyRoutes from './routes/StoryRoutes';
import authRoutes from './routes/AuthRoutes';
import categoryRoutes from './routes/CategoryRoutes';
import { errorHandler } from './middlewares/ErrorHandler';
import swaggerFile from './docs/swagger-output.json';

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
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});
app.use((req: Request, res: Response) => {
  // #swagger.tags = ['Health']
  // #swagger.summary = 'Check if the server is running'
  // #swagger.responses[200] = { description: 'Server is healthy', schema: { status: 'ok', message: 'Server is healthy', timestamp: '2025-12-09T00:00:00.000Z' } }

  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

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
