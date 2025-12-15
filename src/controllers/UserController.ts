import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserUpdateDTO } from '../dtos/UserDTOs';
import { z } from 'zod';
import { UserQueryType } from '../schemas/QuerySchema';
import { handleResponse } from '../utils/Response';
import { ERROR_DEFINITIONS } from '../constants/HTTPConstants';
import { injectable } from 'tsyringe';
import { AuthRequest } from '../types/AuthTypes';
import { AuthService } from '../services/AuthService';

@injectable()
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as UserQueryType;
      const users = await this.userService.getAllUsers(queryParams);
      // res.status(200).json({ success: true, data: users, message: 'Users fetched successfully' });
      handleResponse(res, users, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'Users fetched succesfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      const user = await this.userService.getUserById(userId);
      // res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
      handleResponse(res, user, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'User fetched succesfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      const userData: UserUpdateDTO = req.body;
      const updatedUser = await this.userService.updateUser(userId, userData);
      // res.status(204).json({ success: true, message: 'User updated successfully' });
      handleResponse(res, updatedUser, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'User updated successfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      await this.userService.deactivateUser(userId);
      // res.status(204).json({ success: true, message: 'User deleted successfully' });
      handleResponse(res, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'User deleted successfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      z.uuid().parse(userId);

      const { role } = req.body;
      if (!role) {
        handleResponse(res, null, {
          status: ERROR_DEFINITIONS.BAD_REQUEST.status,
          message: 'Role must be provided',
        });
      }

      const updatedUser = await this.userService.updateUserRole(userId, role);
      handleResponse(res, updatedUser, {
        status: ERROR_DEFINITIONS.OK.status,
        message: 'User role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  changePasswordRequest = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    await this.authService.requestPasswordChange(userId, currentPassword, newPassword);

    handleResponse(res, null, { message: 'Confirmation code sent to email' });
  };

  changePasswordConfirm = async (req: Request, res: Response) => {
    const { token } = req.body;

    await this.authService.confirmPasswordChange(token);

    handleResponse(res, null, { message: 'Password updated successfully' });
  };
}
