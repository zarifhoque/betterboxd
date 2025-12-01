import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { z } from 'zod';
import { UserQueryType } from '../schemas/QuerySchema';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as UserQueryType;
      const users = await userService.getAllUsers(queryParams);
      res.status(200).json({ success: true, data: users, message: 'Users fetched successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      const user = await userService.getUserById(userId);
      res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: UserCreateDTO = req.body;
      const newUser = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      const userData: UserUpdateDTO = req.body;
      await userService.updateUser(userId, userData);
      res.status(204).json({ success: true, message: 'User updated successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      z.uuid().parse(userId);
      await userService.deleteUser(userId);
      res.status(204).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
