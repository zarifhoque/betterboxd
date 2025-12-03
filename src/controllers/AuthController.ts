import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserSigninDTO, UserSignupDTO } from '../dtos/UserDTOs';
import { AuthService } from '../services/AuthService';

const userService = new UserService();
const authService = new AuthService();
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
      const credentials: UserSigninDTO = req.body;
      const { token, user } = await authService.login(credentials);
      res
        .status(200)
        .json({ success: true, data: { token, user }, message: 'User logged in successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
