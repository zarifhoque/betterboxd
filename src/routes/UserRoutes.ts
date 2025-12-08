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
/*swagger.auto = false*/
/* #swagger.tags = ['Users'] */
/* #swagger.summary = 'Get all users with optional pagination and search' */
/* #swagger.parameters['page'] = { description: 'Page number', type: 'integer', in: 'query', required: false } */
/* #swagger.parameters['itemsPerPage'] = { description: 'Number of items per page', type: 'integer', in: 'query', required: false } */
/* #swagger.parameters['name'] = { description: 'Filter by user name', type: 'string', in: 'query', required: false } */
/* #swagger.parameters['email'] = { description: 'Filter by user email', type: 'string', in: 'query', required: false } */
/* #swagger.responses[200] = { description: 'List of users', schema: { $ref: '#/definitions/UserResponseDTO' } } */

router.get(
  '/',
  loggerHandler,
  authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(userSearchSchema, { source: 'query' }),
  userController.getAllUsers.bind(userController),
);
// GET /api/users/:id
/* #swagger.tags = ['Users'] */
/* #swagger.summary = 'Get a single user by ID' */
/* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
/* #swagger.responses[200] = { description: 'User details', schema: { $ref: '#/definitions/UserResponseDTO' } } */
/* #swagger.responses[404] = { description: 'User not found' } */
router.get(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  userController.getUserById.bind(userController),
);

// PUT /api/users/:id (update user)
/* #swagger.tags = ['Users'] */
/* #swagger.summary = 'Update a user by ID' */
/* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
/* #swagger.parameters['body'] = { description: 'User data to update', in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdateDTO' } } */
/* #swagger.responses[200] = { description: 'User updated successfully', schema: { $ref: '#/definitions/UserResponseDTO' } } */
/* #swagger.responses[403] = { description: 'Unauthorized to update this user' } */
router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);

// PUT /api/users/:id/role (update role)
/* #swagger.tags = ['Users'] */
/* #swagger.summary = 'Change a user role (Admin only)' */
/* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
/* #swagger.parameters['body'] = { description: 'Role data', in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdateRoleDTO' } } */
/* #swagger.responses[200] = { description: 'User role updated', schema: { $ref: '#/definitions/UserResponseDTO' } } */
/* #swagger.responses[403] = { description: 'Only admins can change roles' } */
router.put(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.roleChangeAccessHandler,
  validationHandler(userUpdateRoleSchema),
  userController.updateRole.bind(userController),
);

// DELETE /api/users/:id
/* #swagger.tags = ['Users'] */
/* #swagger.summary = 'Deactivate a user (delete)' */
/* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
/* #swagger.responses[200] = { description: 'User deactivated successfully' } */
/* #swagger.responses[403] = { description: 'Unauthorized to delete this user' } */
/* #swagger.responses[404] = { description: 'User not found' } */
router.delete(
  '/:id',
  loggerHandler,
  authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  userController.deactivateUser.bind(userController),
);

export default router;
