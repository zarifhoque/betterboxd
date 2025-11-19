import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';

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
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const user: User | null = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: Partial<User> = req.body;
      const newUser: User = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const userData: Partial<User> = req.body;
      const updatedState: boolean = await userService.updateUser(userId, userData);
      if (!updatedState) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating user with ID:', error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const deletedState: boolean = await userService.softDeleteUser(userId);
      if (!deletedState) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
}
