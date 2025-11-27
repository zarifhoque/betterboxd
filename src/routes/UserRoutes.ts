import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { getUsersQuerySchema, userCreateSchema, userUpdateSchema } from '../schemas/UserSchema';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get(
  '/',
  loggerHandler,
  validationHandler(getUsersQuerySchema, { source: 'query' }),
  userController.getAllUsers.bind(userController),
);
router.get('/:id', userController.getUserById.bind(userController));
router.post(
  '/',
  loggerHandler,
  validationHandler(userCreateSchema),
  userController.createUser.bind(userController),
);
router.put(
  '/:id',
  loggerHandler,
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);
router.delete('/:id', loggerHandler, userController.deleteUser.bind(userController));

export default router;
