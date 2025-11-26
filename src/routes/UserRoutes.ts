import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middlewares/ValidateRequest';
import { userCreateSchema, userUpdateSchema } from '../schemas/UserSchema';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', validateRequest(userCreateSchema), userController.createUser.bind(userController));
router.put(
  '/:id',
  validateRequest(userUpdateSchema),
  userController.updateUser.bind(userController),
);
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;
