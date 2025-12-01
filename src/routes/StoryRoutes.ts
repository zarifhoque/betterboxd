import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';
import { queryParamsSchema } from '../schemas/QuerySchema';

const router = Router();

router.get(
  '/',
  loggerHandler,
  validationHandler(queryParamsSchema, { source: 'query' }),
  StoryController.getAllStories,
);
router.get('/:id', loggerHandler, StoryController.getStoryById);
router.post('/', loggerHandler, validationHandler(storyCreateSchema), StoryController.createStory);
router.put(
  '/:id',
  loggerHandler,
  validationHandler(storyUpdateSchema),
  StoryController.updateStory,
);
router.delete('/:id', loggerHandler, StoryController.deleteStory);

export default router;
