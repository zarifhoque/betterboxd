import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';

export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Update user by ID
  async updateUser(userId: number, userData: Partial<User>): Promise<boolean> {
    const result = await this.userRepository.update(userId, userData);
    return (result.affected ?? 0) > 0;
  }

  // Soft delete user by ID
  async softDeleteUser(userId: number): Promise<boolean> {
    const result = await this.userRepository.softDelete(userId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }

  // Hard delete user by ID
  async hardDeleteUser(userId: number): Promise<boolean> {
    const result = await this.userRepository.delete(userId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }
} 