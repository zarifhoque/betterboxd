import { UserRole } from '../entities/User';

export interface UserCreateDTO {
  username: string;
  name: string;
  email: string;
  role?: UserRole;
  joinDate?: Date;
  profile?: string;
}

export interface UserUpdateDTO {
  username?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  profile?: string;
}

export interface UserResponseDTO {
  userId: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: Date;
}
