import { Router } from 'express';
import { userLoginSchema, userSignupSchema } from '../schemas/UserSchema';
import { AuthController } from '../controllers/AuthController';
import { loggerHandler } from '../middlewares/LoggerHandler';
import { validationHandler } from '../middlewares/ValidationHandler';

const router = Router();
const authController = new AuthController();

// signup route
router.post(
  '/signup',
  loggerHandler,
  validationHandler(userSignupSchema),
  authController.signupUser, // arrow function in controller auto-binds `this`
);

// login route (example)
router.post('/login', loggerHandler, validationHandler(userLoginSchema), authController.loginUser);

export default router;
