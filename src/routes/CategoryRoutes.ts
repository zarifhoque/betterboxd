import { Router } from 'express';
import { container } from 'tsyringe';
import { validationHandler } from '../middlewares/ValidationHandler';
import {
  addCategorySchema,
  removeCategorySchema,
  storyIdParamSchema,
} from '../schemas/CategorySchema';
import { CategoryController } from '../controllers/CategoryController';
import { AuthenticationMiddleWare } from '../middlewares/AuthenticationHandler';

const router = Router();
const categoryController = container.resolve(CategoryController);
const authenticationMiddleWare = container.resolve(AuthenticationMiddleWare);

// GET /api/stories/:storyId/categories
router.get(
  '/stories/:storyId/categories',
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(storyIdParamSchema, { source: 'params' }),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Get all tags for a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.responses[200] = { description: 'List of tags for the story', schema: { $ref: '#/definitions/CategoryResponseDTO' } }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  categoryController.list.bind(categoryController),
);

// POST /api/stories/:storyId/categories
router.post(
  '/stories/:storyId/categories',
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(storyIdParamSchema, { source: 'params' }),
  validationHandler(addCategorySchema),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Add a tag to a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.parameters['body'] = { description: 'Tag to add', in: 'body', required: true, schema: { $ref: '#/definitions/AddCategoryDTO' } }
  // #swagger.responses[200] = { description: 'Tag added successfully' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  categoryController.addCategoryToStory.bind(categoryController),
);
// DELETE /api/stories/:storyId/categories
router.delete(
  '/stories/:storyId/categories',
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(storyIdParamSchema, { source: 'params' }),
  validationHandler(removeCategorySchema),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Remove a tag from a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.parameters['body'] = { description: 'Tag to remove', in: 'body', required: true, schema: { $ref: '#/definitions/RemoveCategoryDTO' } }
  // #swagger.responses[200] = { description: 'Tag removed successfully' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  categoryController.removeTag.bind(categoryController),
);

export default router;
