import { UserRepository } from '../repositories/UserRepository';
import { UserCreateDTO, UserResponseDTO, UserUpdateDTO } from '../dtos/UserDTOs';
import { instanceToPlain } from 'class-transformer';
import { z } from 'zod';
import { UserQueryType } from '../schemas/QuerySchema';
import { ErrorFactory } from '../errors/ErrorFactory';
import { UserRole } from '../entities/User';
import { injectable } from 'tsyringe';
@injectable()
export class UserService {
  // private userRepository = new UserRepository();
  constructor(private userRepository: UserRepository) {}
  async getAllUsers(queryParams: UserQueryType): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.getAllUsers(queryParams);
    return instanceToPlain(users) as UserResponseDTO[];
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    z.uuid().parse(userId);
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw ErrorFactory.notFound(`User with the id ${userId} not found`);
    }
    return instanceToPlain(user) as UserResponseDTO;
  }

  async createUser(userData: UserCreateDTO): Promise<UserResponseDTO> {
    const existingUserByEmail = await this.userRepository.getUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw ErrorFactory.conflict('A user with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.getUserByUsername(userData.username);
    if (existingUserByUsername) {
      throw ErrorFactory.conflict('A user with this username already exists');
    }

    const newUser = await this.userRepository.createUser(userData);
    newUser.isEmailConfirmed = false;
    return instanceToPlain(newUser) as UserResponseDTO;
  }

  async updateUser(userId: string, userData: UserUpdateDTO): Promise<UserResponseDTO> {
    z.uuid().parse(userId);
    const updatedUser = await this.userRepository.updateUser(userId, userData);
    if (!updatedUser) {
      throw ErrorFactory.notFound(`User with the id ${userId} not found`);
    }
    return instanceToPlain(updatedUser) as UserResponseDTO;
  }

  async deactivateUser(userId: string): Promise<void> {
    z.uuid().parse(userId);
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw ErrorFactory.notFound(`User with the id ${userId} not found`);
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw ErrorFactory.notFound(`User with email ${email} not found`);
    }
    return instanceToPlain(user) as UserResponseDTO;
  }
  async doesUserExistByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.getUserByEmail(email);
    return !!user; // true if user exists, false otherwise
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      throw ErrorFactory.notFound(`User with username ${username} not found`);
    }
    return instanceToPlain(user) as UserResponseDTO;
  }

  async doesUserExistByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.getUserByUsername(username);
    return !!user; // true if user exists, false otherwise
  }

  async updateUserRole(userId: string, newRole: UserRole) {
    const userData = await this.userRepository.getUserById(userId);
    if (!userData) {
      throw ErrorFactory.notFound(`User with id ${userId} not found`);
    }
    userData.role = newRole;
    const updatedUser = await this.userRepository.updateUser(userId, userData);
    return instanceToPlain(updatedUser);
  }

  async confirmUserEmailByEmail(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw ErrorFactory.notFound(`User with email ${email} not found`);
    }

    if (user.isEmailConfirmed) return;

    user.isEmailConfirmed = true;
    await this.userRepository.updateUser(user.userId, user);
  }
}
