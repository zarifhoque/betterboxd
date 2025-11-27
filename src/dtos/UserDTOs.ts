import { UserRole } from '../entities/User';
import { Expose } from 'class-transformer';

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

export class UserResponseDTO {
  @Expose()
  userId!: string;
  @Expose()
  username!: string;
  @Expose()
  name!: string;
  @Expose()
  email!: string;
  @Expose()
  role!: UserRole;
  @Expose()
  joinDate!: Date;
}
