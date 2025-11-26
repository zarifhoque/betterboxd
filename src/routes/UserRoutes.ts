import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { getUsersQuerySchema, userCreateSchema, userUpdateSchema } from '../schemas/UserSchema';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get(
  '/',
  validationHandler(getUsersQuerySchema),
  userController.getAllUsers.bind(userController),
);
router.get('/:id', userController.getUserById.bind(userController));
router.post(
  '/',
  validationHandler(userCreateSchema),
  userController.createUser.bind(userController),
);
router.put(
  '/:id',
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;
