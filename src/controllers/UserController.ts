import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users: User[] = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    let userId: number;
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userService.getUserById(userId);
      throw new Error('User not found');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: user });
    } catch (error: unknown) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    const userData: Partial<User> = req.body;
    try {
      const newUser = await userService.createUser(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const userData: Partial<User> = req.body;
    try {
      const updated = await userService.updateUser(userId, userData);
      if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error: unknown) {
      console.error(`Error updating user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    try {
      const deleted = await userService.softDeleteUser(userId);
      if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, message: 'User soft-deleted successfully' });
    } catch (error: unknown) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
