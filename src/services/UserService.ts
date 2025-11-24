import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { UserCreateSchemaType, UserUpdateSchemaType } from '../schemas/UserSchema';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { toUserResponseDTO, toUserResponseDTOs } from '../utils/utils';
<<<<<<< HEAD
import { NotFoundError } from '../errors/AppErrors';
import { z } from 'zod';
=======
>>>>>>> dev

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users: User[] = await this.userRepository.getAllUsers();
    return toUserResponseDTOs(users);
  }

<<<<<<< HEAD
  async getUserById(userId: string): Promise<UserResponseDTO> {
    z.uuid().parse(userId);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with the id ${userId} not found`);
=======
  async getUserById(userId: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found'); // throw generic error to be handled in controller
>>>>>>> dev
    }
    return toUserResponseDTO(user);
  }

  async createUser(userData: UserCreateSchemaType): Promise<UserResponseDTO> {
    const newUser = await this.userRepository.createUser(userData);
    const userResponse = toUserResponseDTO(newUser);
    return userResponse;
  }

  async updateUser(userId: string, userData: UserUpdateSchemaType): Promise<void> {
<<<<<<< HEAD
    z.uuid().parse(userId);
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if (!updatedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
=======
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if (!updatedState) {
      throw new Error('User not found'); // throw generic error to be handled in controller
>>>>>>> dev
    }
  }

  async deleteUser(userId: string): Promise<void> {
<<<<<<< HEAD
    z.uuid().parse(userId);
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
=======
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw new Error('User not found'); // throw generic error to be handled in controller
>>>>>>> dev
    }
  }
}
