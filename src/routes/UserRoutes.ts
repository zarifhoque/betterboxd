import { Router } from 'express';

import { UserController } from '../controllers/UserController';

import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { userUpdateRoleSchema, userUpdateSchema } from '../schemas/UserSchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { userSearchSchema } from '../schemas/SearchSchema';
import { authenticateJWTHandler } from '../middlewares/AuthenticationHandler';

import { container } from 'tsyringe';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationHandler';
// import { logger } from '../config/Logger';

const router = Router();

const userController = container.resolve(UserController);
const authorizationMiddleware = container.resolve(AuthorizationMiddleware);

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
  authorizationMiddleware.modifyUserAccessHandler,
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);

router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.roleChangeAccessHandler,
  validationHandler(userUpdateRoleSchema),
  userController.updateRole.bind(userController),
);

router.delete(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  userController.deactivateUser.bind(userController),
);

export default router;
