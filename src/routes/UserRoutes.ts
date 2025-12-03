import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { userUpdateSchema } from '../schemas/UserSchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { userSearchSchema } from '../schemas/SearchSchema';
import { authenticateJWTHandler } from '../middlewares/AuthenticationHandler';
import { modifyUserAccessHandler } from '../middlewares/AuthorizationHandler';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(userSearchSchema, { source: 'query' }),
  userController.getAllUsers.bind(userController),
);
router.get(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  userController.getUserById.bind(userController),
);
router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  modifyUserAccessHandler,
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);
router.delete(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  modifyUserAccessHandler,
  userController.deleteUser.bind(userController),
);

export default router;
