import { User } from '../entities/User';
import { UserResponseDTO } from '../dtos/UserDTOs';

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    userId: user.userId,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    joinDate: user.joinDate,
  };
}

export function toUserResponseDTOs(users: User[]): UserResponseDTO[] {
  return users.map(toUserResponseDTO);
}
