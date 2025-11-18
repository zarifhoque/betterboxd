import express, { Request, Response } from 'express';
import cors from 'cors';
import { AppDataSource } from './database/DataSource';
import userRoutes from './routes/UserRoutes';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  }
  ).catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app = express();

const PORT: number = parseInt(process.env.PORT || '3000', 10);
if (isNaN(PORT)) {
    throw new Error('Invalid PORT number');
}

app.use(express.json());
app.use(cors());


app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('Movie Review API is running!');
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err: Error) => {
    console.error('Server error:', err)
});
