import { UserRole } from '../entities/User';

export interface UserCreateDTO {
  username: string;
  name: string;
  email: string;
  bio?: string;
  joinDate?: Date;
}

export interface UserUpdateDTO {
  username?: string;
  name?: string;
  bio?: string;
  // role?: UserRole;
}

export type UserResponseDTO = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  email: string;
  role: UserRole;
  joinDate: Date;
};

export interface UserSignupDTO {
  username: string;
  name: string;
  email: string;
  joinDate?: Date;
  password?: string;
}

export interface UserSigninDTO {
  email: string;
  password: string;
}

export interface UserUpdateRoleDTO {
  userId: string;
  role: UserRole;
}

export interface UserSigninResponseDTO {
  token: string;
  user: UserResponseDTO;
}
