import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { applyPagination } from '../utils/Pagination';
import { UserQueryType } from '../schemas/QuerySchema';
import { USER_FUZZY_THRESHOLDS } from '../constants/SearchConstants';


export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  // Get all users
  async getAllUsers(queryParams: UserQueryType): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    const { name, email } = queryParams;
    const whereParts: string[] = [];
    const parameters: Record<string, string | number> = {};

    if (name) {
      whereParts.push('similarity(user.name, :name) > :nameThreshold');
      parameters.name = name;
      parameters.nameThreshold = USER_FUZZY_THRESHOLDS.NAME_THRESHOLD;
    }

    if (email) {
      whereParts.push('similarity(user.email, :email) > :emailThreshold');
      parameters.email = email;
      parameters.emailThreshold = USER_FUZZY_THRESHOLDS.EMAIL_THRESHOLD;
    }

    if (whereParts.length > 0) {
      query.andWhere(whereParts.join(' OR '), parameters);

      const orderExpressions: string[] = [];
      if (name) orderExpressions.push('similarity(user.name, :name)');
      if (email) orderExpressions.push('similarity(user.email, :email)');

      query.orderBy(`GREATEST(${orderExpressions.join(', ')})`, 'DESC');
    }

    return applyPagination(query, queryParams, 'user').getMany();
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
