import { UserRepository } from '../repositories/UserRepository';
import { UserCreateDTO, UserResponse, UserSignupDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { instanceToPlain } from 'class-transformer';
import { z } from 'zod';
import { createError } from '../errors/ErrorFactory';
import { UserQueryType } from '../schemas/QuerySchema';
import * as bcrypt from 'bcrypt';
import { ENV } from '../config/Env';
import { AuthRepository } from '../repositories/AuthRepository';
import { AppDataSource } from '../database/DataSource';
import { Auth } from '../entities/Auth';
import { User } from '../entities/User';
export class UserService {
  private userRepository = new UserRepository();
  private authRepository = new AuthRepository();

  async getAllUsers(queryParams: UserQueryType): Promise<UserResponse[]> {
    const users = await this.userRepository.getAllUsers(queryParams);
    return instanceToPlain(users) as UserResponse[];
  }

  async getUserById(userId: string): Promise<UserResponse> {
    z.uuid().parse(userId);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw createError('NotFound', `User with the id ${userId} not found`);
    }
    return instanceToPlain(user) as UserResponse;
  }

  async createUser(userData: UserCreateDTO): Promise<UserResponse> {
    const existingUserByEmail = await this.userRepository.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw createError('Conflict', 'A user with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw createError('Conflict', 'A user with this username already exists');
    }

    const newUser = await this.userRepository.createUser(userData);

    return instanceToPlain(newUser) as UserResponse;
  }

  async signupUser(userData: UserSignupDTO): Promise<UserResponse> {
    const existingUserByEmail = await this.userRepository.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw createError('Conflict', 'A user with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw createError('Conflict', 'A user with this username already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password!, ENV.SALT_ROUNDS);

    const newUser = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      // Await the creation if createUser is async
      const userEntity = await this.userRepository.createUser({
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      // Save using transactional entity manager
      const savedUser = await transactionalEntityManager.getRepository(User).save(userEntity);

      // Create Auth entity
      const authEntity = await this.authRepository.createAuth({
        username: savedUser.username,
        email: savedUser.email,
        hashedPassword,
        userByUsername: savedUser,
        userByEmail: savedUser,
        passwordLastModificationTime: new Date(),
      });

      await transactionalEntityManager.getRepository(Auth).save(authEntity);

      return savedUser;
    });

    return instanceToPlain(newUser) as UserResponse;
  }

  async updateUser(userId: string, userData: UserUpdateDTO): Promise<void> {
    z.uuid().parse(userId);
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if (!updatedState) {
      throw createError('NotFound', `User with the id ${userId} not found`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    z.uuid().parse(userId);
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw createError('NotFound', `User with the id ${userId} not found`);
    }
  }
}
