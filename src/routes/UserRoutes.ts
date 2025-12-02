import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationHandler } from '../middlewares/ValidationHandler';
import { loggerHandler } from '../middlewares/LoggerHandler';
// import { userCreateSchema } from '../schemas/UserSchema';
import { userSignupSchema, userUpdateSchema } from '../schemas/UserSchema';
import { paginationSchema } from '../schemas/PaginationSchema';
import { userSearchSchema } from '../schemas/SearchSchema';

const router = Router();
const userController = new UserController();

// GET /api/users
router.get(
  '/',
  loggerHandler,
  validationHandler(paginationSchema, { source: 'query' }),
  validationHandler(userSearchSchema, { source: 'query' }),
  userController.getAllUsers.bind(userController),
);
router.get('/:id', userController.getUserById.bind(userController));
// router.post(
//   '/',
//   loggerHandler,
//   validationHandler(userCreateSchema),
//   userController.createUser.bind(userController),
// );
router.put(
  '/:id',
  loggerHandler,
  validationHandler(userUpdateSchema),
  userController.updateUser.bind(userController),
);
router.delete('/:id', loggerHandler, userController.deleteUser.bind(userController));

router.post(
  '/auth/signup',
  loggerHandler,
  validationHandler(userSignupSchema),
  userController.signupUser.bind(userController),
);

router.post('/auth/login', loggerHandler, userController.loginUser.bind(userController));

export default router;
