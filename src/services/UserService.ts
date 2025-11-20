import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.getUserById(userId);
    if(!user) {
      throw new Error('User not found'); // throw generic error to be handled in controller
    }
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<void> {
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if(!updatedState) {
      throw new Error('User not found'); // throw generic error to be handled in controller
    }
  }

  async softDeleteUser(userId: number): Promise<void> {
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if(!deletedState) {
      throw new Error('User not found'); // throw generic error to be handled in controller
    }
  }

  async hardDeleteUser(userId: number): Promise<void> {
    const deletedState = this.userRepository.hardDeleteUser(userId);
    if(!deletedState) {
      throw new Error('User not found'); // throw generic error to be handled in controller
    }
  }
}
