import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// GET /api/users
router.get('/users', UserController.getAllUsers);

export default router;
