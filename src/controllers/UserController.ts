import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import {
  userUpdateSchema,
  userCreateSchema,
  UserCreateSchemaType,
  UserUpdateSchemaType,
} from '../schemas/UserSchema';
import { UserResponseDTO } from '../dtos/UserDTOs';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users: UserResponseDTO[] = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      const user: UserResponseDTO = await userService.getUserById(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: unknown) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: UserCreateSchemaType = userCreateSchema.parse(req.body);
      const newUser: UserResponseDTO = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      const userData: UserUpdateSchemaType = userUpdateSchema.parse(req.body);
      await userService.updateUser(userId, userData);
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId: string = req.params.id;
      await userService.deleteUser(userId);
      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
