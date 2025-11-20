import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import {UserCreateSchemaType, UserUpdateSchemaType } from '../schemas/userSchema';
import { UserResponseDTO } from '../dtos/userDTOs';

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

  async createUser(userData: UserCreateSchemaType): Promise<UserResponseDTO> {
    const newUser = await this.userRepository.createUser(userData);
    const userResponse: UserResponseDTO = {
      userId: newUser.userId,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      joinDate: newUser.joinDate,
      profile: newUser.profile,
      passwordLastModificationTime: newUser.passwordLastModificationTime,
    };
    return userResponse;

  }

  async updateUser(userId: number, userData: UserUpdateSchemaType): Promise<void> {
    
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
