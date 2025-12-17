import { UserCreateDTO, UserResponseDTO } from '../../dtos/UserDTOs';
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

export const UserUpdateDTOData = {
  name: 'Updated User',
  bio: 'This is an updated bio',
};

// Mock User Response DTOs (for controller tests)
export const mockUserResponseDTO: UserResponseDTO = {
  userId: '550e8400-e29b-41d4-a716-446655440001',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  bio: 'A test user bio',
  role: UserRole.USER,
  joinDate: new Date('2025-01-01'),
  isEmailConfirmed: true,
};

export const mockUserResponseDTO2: UserResponseDTO = {
  userId: '550e8400-e29b-41d4-a716-446655440002',
  username: 'adminuser',
  name: 'Admin User',
  email: 'admin@example.com',
  bio: 'An admin user',
  role: UserRole.ADMIN,
  joinDate: new Date('2024-12-01'),
  isEmailConfirmed: true,
};

export const mockUserResponseDTO3: UserResponseDTO = {
  userId: '550e8400-e29b-41d4-a716-446655440003',
  username: 'newuser',
  name: 'New User',
  email: 'newuser@example.com',
  bio: 'A new user',
  role: UserRole.USER,
  joinDate: new Date('2025-01-15'),
  isEmailConfirmed: false,
};

// Mock Users Array (Response DTOs)
export const mockUsersArray: UserResponseDTO[] = [
  mockUserResponseDTO,
  mockUserResponseDTO2,
  mockUserResponseDTO3,
];

// mock user jwt payload
export const mockUserJwtPayload = {
  userId: '550e8400-e29b-41d4-a716-446655440001',
  role: UserRole.USER,
  pwdlmod: Date.now(),
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};
