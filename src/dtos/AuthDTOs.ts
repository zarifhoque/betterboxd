import { UserSessionDTO } from './UserDTOs';

export interface LoginResponseDTO {
  token: string;
  user: UserSessionDTO;
}
