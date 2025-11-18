import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    return this.userRepository.updateUser(id, userData);
  }

  async softDeleteUser(id: number): Promise<boolean> {
    return this.userRepository.softDeleteUser(id);
  }

  async hardDeleteUser(id: number): Promise<boolean> {
    return this.userRepository.hardDeleteUser(id);
  }
}
