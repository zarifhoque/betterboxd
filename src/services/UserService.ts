import { UserRepository } from '../repositories/UserRepository';
import { UserCreateDTO, UserResponseDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { plainToInstance } from 'class-transformer';
import { z } from 'zod';
import { createError } from '../errors/ErrorFactory';
import { QueryParamsSchema } from '../schemas/QuerySchema';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(paginationOptions: QueryParamsSchema): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAllUsers(paginationOptions);
    return plainToInstance(UserResponseDTO, users);
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    z.uuid().parse(userId);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw createError('NotFound', `User with the id ${userId} not found`);
    }
    return plainToInstance(UserResponseDTO, user);
  }

  async createUser(userData: UserCreateDTO): Promise<UserResponseDTO> {
    const existingUserByEmail = await this.userRepository.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw createError('Conflict', 'A user with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw createError('Conflict', 'A user with this username already exists');
    }

    const newUser = await this.userRepository.createUser(userData);

    return plainToInstance(UserResponseDTO, newUser);
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
