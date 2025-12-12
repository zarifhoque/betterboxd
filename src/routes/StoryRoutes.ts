import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { storySearchSchema } from '../schemas/SearchSchema';
import { AuthenticationMiddleWare } from '../middlewares/AuthenticationHandler';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationHandler';
import { container } from 'tsyringe';

const router = Router();
const storyController = container.resolve(StoryController);
const authorizationMiddleware = container.resolve(AuthorizationMiddleware);
const authenticationMiddleWare = container.resolve(AuthenticationMiddleWare);
// GET /api/stories
router.get(
  '/',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(storySearchSchema, { source: 'query' }),
  // #swagger.tags = ['Stories']
  // #swagger.summary = 'Get all stories with optional pagination and search'
  // #swagger.parameters['page'] = { description: 'Page number', type: 'integer', in: 'query', required: false }
  // #swagger.parameters['itemsPerPage'] = { description: 'Number of items per page', type: 'integer', in: 'query', required: false }
  // #swagger.parameters['title'] = { description: 'Filter by story title', type: 'string', in: 'query', required: false }
  // #swagger.responses[200] = { description: 'List of stories', schema: { $ref: '#/definitions/StoryResponseDTO' } }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  storyController.getAllStories.bind(storyController),
);

// GET /api/stories/:id
router.get(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  // #swagger.tags = ['Stories']
  // #swagger.summary = 'Get a single story by ID'
  // #swagger.parameters['id'] = { description: 'Story ID', type: 'string', in: 'path', required: true }
  // #swagger.responses[200] = { description: 'Story details', schema: { $ref: '#/definitions/StoryResponseDTO' } }
  // #swagger.responses[404] = { description: 'Story not found' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  storyController.getStoryById.bind(storyController),
);

// POST /api/stories
router.post(
  '/',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(storyCreateSchema),
  // #swagger.tags = ['Stories']
  // #swagger.summary = 'Create a new story'
  // #swagger.parameters['body'] = { description: 'Story data', in: 'body', required: true, schema: { $ref: '#/definitions/StoryCreateDTO' } }
  // #swagger.responses[201] = { description: 'Story created successfully', schema: { $ref: '#/definitions/StoryResponseDTO' } }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  storyController.createStory.bind(storyController),
);
// PUT /api/stories/:id
router.put(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.modifyStoryAccessHandler,
  validationHandler(storyUpdateSchema),
  // #swagger.tags = ['Stories']
  // #swagger.summary = 'Update a story by ID'
  // #swagger.parameters['id'] = { description: 'Story ID', type: 'string', in: 'path', required: true }
  // #swagger.parameters['body'] = { description: 'Story data to update', in: 'body', required: true, schema: { $ref: '#/definitions/StoryUpdateDTO' } }
  // #swagger.responses[200] = { description: 'Story updated successfully', schema: { $ref: '#/definitions/StoryResponseDTO' } }
  // #swagger.responses[403] = { description: 'Unauthorized to update this story' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  storyController.updateStory.bind(storyController),
);

// DELETE /api/stories/:id
router.delete(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.modifyStoryAccessHandler,
  // #swagger.tags = ['Stories']
  // #swagger.summary = 'Delete a story by ID'
  // #swagger.parameters['id'] = { description: 'Story ID', type: 'string', in: 'path', required: true }
  // #swagger.responses[200] = { description: 'Story deleted successfully' }
  // #swagger.responses[403] = { description: 'Unauthorized to delete this story' }
  // #swagger.responses[404] = { description: 'Story not found' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  storyController.deleteStory.bind(storyController),
);

export default router;
