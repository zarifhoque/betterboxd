import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { storySearchSchema } from '../schemas/SearchSchema';
import { authenticateJWTHandler } from '../middlewares/AuthenticationHandler';
import { modifyStoryAccessHandler } from '../middlewares/AuthorizationHandler';

const router = Router();

router.get(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(storySearchSchema, { source: 'query' }),
  StoryController.getAllStories,
);
router.get('/:id', loggerHandler, authenticateJWTHandler, StoryController.getStoryById);
router.post(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(storyCreateSchema),
  StoryController.createStory,
);
router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  modifyStoryAccessHandler,
  validationHandler(storyUpdateSchema),
  StoryController.updateStory,
);
router.delete(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  modifyStoryAccessHandler,
  StoryController.deleteStory,
);

export default router;
