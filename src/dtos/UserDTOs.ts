import { UserRole } from '../entities/User';

export interface UserCreateDTO {
  username: string;
  name: string;
  email: string;
  bio?: string;
  joinDate?: Date;
  profile?: string;
}

export interface UserUpdateDTO {
  username?: string;
  name?: string;
  bio?: string;
  role?: UserRole;
  profile?: string;
}

export type UserResponse = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  email: string;
  role: UserRole;
  joinDate: Date;
};
