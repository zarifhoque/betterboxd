import { UserRole } from '../entities/User';

export interface UserDTO {
  username: string;
  name: string;
  email: string;
  role?: UserRole;
  joinDate?: Date;
  profile?: string;
}

export interface UserResponseDTO {
  userId: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: Date;
  profile?: string;
  passwordLastModificationTime?: Date;
}
