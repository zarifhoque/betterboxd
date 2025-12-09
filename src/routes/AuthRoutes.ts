import { Router } from 'express';
import { userLoginSchema, userSignupSchema } from '../schemas/UserSchema';
import { AuthController } from '../controllers/AuthController';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { validationHandler } from '../middlewares/ValidationHandler';
import { container } from 'tsyringe';

const router = Router();
const authController = container.resolve(AuthController);

// POST /api/auth/signup
router.post(
  '/signup',
  loggerHandler,
  validationHandler(userSignupSchema),
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  // #swagger.parameters['body'] = { description: 'Signup data', in: 'body', required: true, schema: { $ref: '#/definitions/UserSignupDTO' } }
  // #swagger.responses[201] = { description: 'User created successfully', schema: { $ref: '#/definitions/UserResponseDTO' } }
  authController.signupUser.bind(authController),
);

// POST /api/auth/login
router.post(
  '/login',
  loggerHandler,
  validationHandler(userLoginSchema),
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login a user'
  // #swagger.parameters['body'] = { description: 'Login credentials', in: 'body', required: true, schema: { $ref: '#/definitions/UserSigninDTO' } }
  // #swagger.responses[200] = { description: 'Login successful', schema: { $ref: '#/definitions/UserSigninResponseDTO' } }
  authController.loginUser.bind(authController),
);

export default router;
