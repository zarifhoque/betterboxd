import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { UserCreateSchemaType, UserUpdateSchemaType } from '../schemas/UserSchema';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { toUserResponseDTO, toUserResponseDTOs } from '../utils/utils';
import { ConflictError, NotFoundError } from '../errors/AppErrors';
import { z } from 'zod';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users: User[] = await this.userRepository.getAllUsers();
    return toUserResponseDTOs(users);
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    z.uuid().parse(userId);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
    return toUserResponseDTO(user);
  }

  async createUser(userData: UserCreateSchemaType): Promise<UserResponseDTO> {
    const existingUserByEmail = await this.userRepository.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new ConflictError('A user with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw new ConflictError('A user with this username already exists');
    }

    const newUser = await this.userRepository.createUser(userData);
    const userResponse = toUserResponseDTO(newUser);
    return userResponse;
  }

  async updateUser(userId: string, userData: UserUpdateSchemaType): Promise<void> {
    z.uuid().parse(userId);
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if (!updatedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    z.uuid().parse(userId);
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
  }
}
