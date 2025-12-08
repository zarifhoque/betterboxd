import { Router } from 'express';
import { userLoginSchema, userSignupSchema } from '../schemas/UserSchema';
import { AuthController } from '../controllers/AuthController';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { validationHandler } from '../middlewares/ValidationHandler';
import { container } from 'tsyringe';

const router = Router();
const authController = container.resolve(AuthController);

// signup route
router.post(
  '/signup',
  loggerHandler,
  validationHandler(userSignupSchema),
  authController.signupUser.bind(authController),
);

// login route (example)
router.post(
  '/login',
  loggerHandler,
  validationHandler(userLoginSchema),
  authController.loginUser.bind(authController),
);

export default router;
