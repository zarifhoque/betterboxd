import { Router } from 'express';
import { container } from 'tsyringe';
import { TagController } from '../controllers/CategoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import {
  addCategorySchema,
  removeCategorySchema,
  storyIdParamSchema,
} from '../schemas/CategorySchema';

const router = Router();
const tagController = container.resolve(TagController);

// POST /api/stories/:storyId/categories
router.post(
  '/stories/:storyId/categories',
  validationHandler(storyIdParamSchema, { source: 'params' }),
  validationHandler(addCategorySchema),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Add a tag to a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.parameters['body'] = { description: 'Tag to add', in: 'body', required: true, schema: { $ref: '#/definitions/AddCategoryDTO' } }
  // #swagger.responses[200] = { description: 'Tag added successfully' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  tagController.addCategoryToStory.bind(tagController),
);
// DELETE /api/stories/:storyId/categories
router.delete(
  '/stories/:storyId/categories',
  validationHandler(storyIdParamSchema, { source: 'params' }),
  validationHandler(removeCategorySchema),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Remove a tag from a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.parameters['body'] = { description: 'Tag to remove', in: 'body', required: true, schema: { $ref: '#/definitions/RemoveCategoryDTO' } }
  // #swagger.responses[200] = { description: 'Tag removed successfully' }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  tagController.removeTag.bind(tagController),
);

// GET /api/stories/:storyId/categories
router.get(
  '/stories/:storyId/categories',
  validationHandler(storyIdParamSchema, { source: 'params' }),
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Get all tags for a story'
  // #swagger.parameters['storyId'] = { description: 'Story ID', in: 'path', required: true, type: 'string' }
  // #swagger.responses[200] = { description: 'List of tags for the story', schema: { $ref: '#/definitions/CategoryResponseDTO' } }
  /* #swagger.security = [{ "bearerAuth": [] }] */
  tagController.list.bind(tagController),
);

export default router;
