import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { PaginationOptions } from '../utils/Pagination';

export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  // Get all users
  async getAllUsers(options: PaginationOptions = {}): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    if (options.page !== undefined) {
      const skip = (options.page - 1) * options.itemsPerPage!;
      query.skip(skip).take(options.itemsPerPage);
    }
    if (options.offset !== undefined) {
      query.skip(options.offset).take(options.limit);
    }
    if (options.startAfter) {
      query.where('user.userId > :startAfter', { startAfter: options.startAfter });
    }

    return query.getMany();
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Create a new user
  async createUser(userData: UserCreateDTO): Promise<User> {
    const user: User = await this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Update user by ID
  async updateUser(userId: string, userData: UserUpdateDTO): Promise<boolean> {
    const result = await this.userRepository.update(userId, userData);
    return (result.affected ?? 0) > 0;
  }

  // Soft delete user by ID
  async softDeleteUser(userId: string): Promise<boolean> {
    const result = await this.userRepository.softDelete(userId);
    return (result.affected ?? 0) > 0; // safe nullish handling
  }
}
