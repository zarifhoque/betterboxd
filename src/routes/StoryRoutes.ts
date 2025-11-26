import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';

const router = Router();

router.get('/', StoryController.getAllStories);
router.get('/:id', StoryController.getStoryById);
router.post('/', validationHandler(storyCreateSchema), StoryController.createStory);
router.put('/:id', validationHandler(storyUpdateSchema), StoryController.updateStory);
router.delete('/:id', StoryController.deleteStory);

export default router;
