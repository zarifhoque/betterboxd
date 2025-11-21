import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';
import { UserDTO, UserResponseDTO } from '../dtos/userDTOs';
import { UserUpdateSchemaType } from '../schemas/UserSchema';

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
  async createUser(userData: UserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Update user by ID
  async updateUser(userId: number, userData: Partial<UserDTO>): Promise<boolean> {
    const result = await this.userRepository.update(userId, userData);
    return (result.affected ?? 0) > 0;
  }

  // Soft delete user by ID
  async softDeleteUser(userId: number): Promise<boolean> {
    const result = await this.userRepository.softDelete(userId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }
}
