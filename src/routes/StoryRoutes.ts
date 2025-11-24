import { Router } from 'express';
import { StoryController } from '../controllers/StoryController';

const router = Router();

router.get('/', StoryController.getAllStories);
router.get('/:id', StoryController.getStoryById);
router.post('/', StoryController.createStory);
router.put('/:id', StoryController.updateStory);
router.delete('/:id', StoryController.deleteStory);

export default router;
