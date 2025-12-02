import { UserResponse } from './UserDTOs';

export interface LoginResponseDTO {
  token: string;
  user: UserResponse;
}
