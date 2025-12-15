import { Router } from 'express';

import { UserController } from '../controllers/UserController';

import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
import {
  passwordChangeConfirmSchema,
  passwordChangeRequestSchema,
  userUpdateRoleSchema,
  userUpdateSchema,
} from '../schemas/UserSchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { userSearchSchema } from '../schemas/SearchSchema';
import { AuthenticationMiddleWare } from '../middlewares/AuthenticationHandler';
import { container } from 'tsyringe';
import { AuthorizationMiddleware } from '../middlewares/AuthorizationHandler';

const router = Router();

const userController = container.resolve(UserController);
const authorizationMiddleware = container.resolve(AuthorizationMiddleware);
const authenticationMiddleWare = container.resolve(AuthenticationMiddleWare);

// GET /api/users/profile
router.get(
  '/profile',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Get the user profile' */
  /* #swagger.responses[200] = { description: 'User profile fetched successfully', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.getProfile.bind(userController),
);

// PUT /api/users/profile
router.put(
  '/profile',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  validationHandler(userUpdateSchema),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Update a user */
  /* #swagger.parameters['body'] = { description: 'User data to update', in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdateDTO' } } */
  /* #swagger.responses[200] = { description: 'User updated successfully', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.responses[403] = { description: 'Unauthorized to update this user' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.updateProfile.bind(userController),
);

// GET /api/users
router.get(
  '/',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(userSearchSchema, { source: 'query' }),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Get all users with optional pagination and search' */
  /* #swagger.parameters['page'] = { description: 'Page number', type: 'integer', in: 'query', required: false } */
  /* #swagger.parameters['itemsPerPage'] = { description: 'Number of items per page', type: 'integer', in: 'query', required: false } */
  /* #swagger.parameters['name'] = { description: 'Filter by user name', type: 'string', in: 'query', required: false } */
  /* #swagger.parameters['email'] = { description: 'Filter by user email', type: 'string', in: 'query', required: false } */
  /* #swagger.responses[200] = { description: 'List of users', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.getAllUsers.bind(userController),
);
// GET /api/users/:id
router.get(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Get a single user by ID' */
  /* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
  /* #swagger.responses[200] = { description: 'User details', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.responses[404] = { description: 'User not found' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.getUserById.bind(userController),
);

// PUT /api/users/:id (update user)
router.put(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  validationHandler(userUpdateSchema),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Update a user by ID' */
  /* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
  /* #swagger.parameters['body'] = { description: 'User data to update', in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdateDTO' } } */
  /* #swagger.responses[200] = { description: 'User updated successfully', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.responses[403] = { description: 'Unauthorized to update this user' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.updateUser.bind(userController),
);

// PUT /api/users/:id/role (update role)
router.put(
  '/:id/role',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.roleChangeAccessHandler,
  validationHandler(userUpdateRoleSchema),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Change a user role (Admin only)' */
  /* #swagger.parameters['body'] = { description: 'Role data', in: 'body', required: true, schema: { $ref: '#/definitions/UserUpdateRoleDTO' } } */
  /* #swagger.responses[200] = { description: 'User role updated', schema: { $ref: '#/definitions/UserResponseDTO' } } */
  /* #swagger.responses[403] = { description: 'Only admins can change roles' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.updateRole.bind(userController),
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  loggerHandler,
  authenticationMiddleWare.authenticateJWTHandler,
  authorizationMiddleware.modifyUserAccessHandler,
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Deactivate a user (delete)' */
  /* #swagger.parameters['id'] = { description: 'User ID', type: 'string', in: 'path', required: true } */
  /* #swagger.responses[200] = { description: 'User deactivated successfully' } */
  /* #swagger.responses[403] = { description: 'Unauthorized to delete this user' } */
  /* #swagger.responses[404] = { description: 'User not found' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.deactivateUser.bind(userController),
);

// POST /api/users/change-password/request
router.post(
  '/change-password/request',
  validationHandler(passwordChangeRequestSchema),
  authenticationMiddleWare.authenticateJWTHandler,
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Request a password change' */
  /* #swagger.parameters['body'] = { description: 'Password change request data', in: 'body', required: true, schema: { $ref: '#/definitions/PasswordChangeRequestDTO' } } */
  /* #swagger.responses[200] = { description: 'Password change requested successfully' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  userController.changePasswordRequest.bind(userController),
);

// POST /api/users/change-password/confirm
router.post(
  '/change-password/confirm',
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Confirm a password change' */
  /* #swagger.parameters['body'] = { description: 'Password change confirmation data', in: 'body', required: true, schema: { $ref: '#/definitions/PasswordChangeConfirmDTO' } } */
  /* #swagger.responses[200] = { description: 'Password changed successfully' } */
  /* #swagger.security = [{ "bearerAuth": [] }] */
  validationHandler(passwordChangeConfirmSchema),
  userController.changePasswordConfirm.bind(userController),
);

export default router;
