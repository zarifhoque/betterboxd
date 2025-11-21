import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { UserCreateSchemaType, UserUpdateSchemaType } from '../schemas/UserSchema';
import { UserResponseDTO } from '../dtos/UserDTOs';
import { toUserResponseDTO, toUserResponseDTOs } from '../utils/utils';
import { NotFoundError } from '../errors/AppErrors';

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users: User[] = await this.userRepository.getAllUsers();
    return toUserResponseDTOs(users);
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
    return toUserResponseDTO(user);
  }

  async createUser(userData: UserCreateSchemaType): Promise<UserResponseDTO> {
    const newUser = await this.userRepository.createUser(userData);
    const userResponse = toUserResponseDTO(newUser);
    return userResponse;
  }

  async updateUser(userId: string, userData: UserUpdateSchemaType): Promise<void> {
    const updatedState = await this.userRepository.updateUser(userId, userData);
    if (!updatedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedState = await this.userRepository.softDeleteUser(userId);
    if (!deletedState) {
      throw new NotFoundError(`User with the id ${userId} not found`);
    }
  }
}
