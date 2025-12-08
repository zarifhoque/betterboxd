import { UserResponseDTO } from './UserDTOs';

export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
}
