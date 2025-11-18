import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';

const userService = new UserService();

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users: User[] = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    try {
      const user = await userService.getUserById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createUser(req: Request, res: Response) {
    const userData: Partial<User> = req.body;
    try {
      const newUser = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const userData: Partial<User> = req.body;
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error: any) {
      console.error(`Error updating user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    try {
      const deleted = await userService.softDeleteUser(userId);
      if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: any) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
