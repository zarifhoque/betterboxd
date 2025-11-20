import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import { userUpdateSchema, userCreateSchema, UserCreateSchemaType, UserUpdateSchemaType } from '../schemas/userSchema';
import { UserResponseDTO } from '../dtos/userDTOs';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users: User[] = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      else {
        console.error('Unknown error fetching users:', error);
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const user: User | null = await userService.getUserById(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      else {
        console.error('Unknown error fetching user:', error);
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserCreateSchemaType = userCreateSchema.parse(req.body);
      const newUser: UserResponseDTO = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      else {
        console.error('Unknown error creating user:', error);
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const userData: UserUpdateSchemaType = userUpdateSchema.parse(req.body);
      await userService.updateUser(userId, userData);
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating user with ID:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      else {
        console.error('Unknown error updating user:', error);
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      await userService.softDeleteUser(userId);
      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      else {
        console.error('Unknown error deleting user:', error);
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }
}