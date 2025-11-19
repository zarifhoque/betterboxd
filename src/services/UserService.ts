import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<boolean> {
    return this.userRepository.updateUser(userId, userData);
  }

  async softDeleteUser(userId: number): Promise<boolean> {
    return this.userRepository.softDeleteUser(userId);
  }

  async hardDeleteUser(userId: number): Promise<boolean> {
    return this.userRepository.hardDeleteUser(userId);
  }
}
