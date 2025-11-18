import { Request, Response } from 'express';
import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const users = await userRepository.find({ relations: ['auth'] });

      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
