import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserSigninDTO, UserSignupDTO } from '../dtos/UserDTOs';
import { AuthService } from '../services/AuthService';

const userService = new UserService();
// const authService = new AuthService();
export class AuthController {
  async signupUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body as unknown as UserSignupDTO;
      const newUser = await userService.signupUser(userData);
      res
        .status(201)
        .json({ success: true, data: newUser, message: 'User signed up successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: UserSigninDTO = req.body;
      // const user = await
      // const token = await auth.signin(userData);
      // res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
