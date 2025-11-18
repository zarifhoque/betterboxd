import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// GET /api/users
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;
