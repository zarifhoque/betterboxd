import { UserCreateDTO } from '../../dtos/UserDTOs';
import { User, UserRole } from '../../entities/User';

export const firstMockUserData: User = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  bio: 'A test user',
  joinDate: new Date('2025-01-01T00:00:00Z'),
  role: UserRole.USER,
  deletedAt: null,
  isEmailConfirmed: false,
};

export const secondMockUserData: User = {
  userId: '660e8400-e29b-41d4-a716-446655440000',
  username: 'seconduser',
  name: 'Second User',
  email: 'second@example.com',
  bio: 'Another test user',
  joinDate: new Date('2025-02-01T00:00:00Z'),
  role: UserRole.USER,
  deletedAt: null,
  isEmailConfirmed: true,
};

export const userCreateDTOData: UserCreateDTO = {
  username: 'newuser',
  name: 'New User',
  email: 'newuser@example.com',
  bio: 'I am a new user',
};
