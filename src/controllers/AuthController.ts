import { Request, Response, NextFunction } from 'express';
import { UserSigninDTO, UserSignupDTO } from '../dtos/UserDTOs';
import { AuthService } from '../services/AuthService';
import { handleResponse } from '../utils/Response';
import { ERROR_DEFINITIONS } from '../constants/HTTPConstants';
import { injectable } from 'tsyringe';

// const authService = new AuthService();
@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}
  async signupUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body as unknown as UserSignupDTO;
      const newUser = await this.authService.signupUser(userData);
      handleResponse(res, newUser, {
        status: ERROR_DEFINITIONS.CREATED.status,
        message: 'User signed up successfully. Please check your email to confirm your account. ',
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: UserSigninDTO = req.body;
      const { token, user } = await this.authService.login(credentials);
      handleResponse(
        res,
        { token, user },
        {
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User logged in successfully',
        },
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  async confirmUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;

      await this.authService.confirmEmail(token);
      handleResponse(
        res,
        {},
        {
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User confirmed in the backend',
        },
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}
