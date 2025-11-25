import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';
import { validateRequest } from '../middlewares/validateRequest';
import { storyCreateSchema, storyUpdateSchema } from '../schemas/StorySchema';

const router = Router();

router.get('/', StoryController.getAllStories);
router.get('/:id', StoryController.getStoryById);
router.post('/', validateRequest(storyCreateSchema), StoryController.createStory);
router.put('/:id', validateRequest(storyUpdateSchema), StoryController.updateStory);
router.delete('/:id', StoryController.deleteStory);

export default router;
