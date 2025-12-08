import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { storySearchSchema } from '../schemas/SearchSchema';
import { authenticateJWTHandler } from '../middlewares/AuthenticationHandler';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationHandler';
import { container } from 'tsyringe';

const router = Router();
const storyController = container.resolve(StoryController);
const authorizationMiddleware = container.resolve(AuthorizationMiddleware);

router.get(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(storySearchSchema, { source: 'query' }),
  storyController.getAllStories.bind(storyController),
);
router.get('/:id', loggerHandler, authenticateJWTHandler, storyController.getStoryById);
router.post(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(storyCreateSchema),
  // storyController.createStory,
  storyController.createStory.bind(storyController),
);
router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.modifyStoryAccessHandler,
  validationHandler(storyUpdateSchema),
  // storyController.updateStory,
  storyController.updateStory.bind(storyController),
);
router.delete(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.modifyStoryAccessHandler,
  // storyController.deleteStory,
  storyController.deleteStory.bind(storyController),
);

export default router;
