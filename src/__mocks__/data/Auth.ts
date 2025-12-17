import { User, UserRole } from '../../entities/User';
import { Auth } from '../../entities/Auth';
import { UserSignupDTO, UserSigninDTO, UserResponseDTO } from '../../dtos/UserDTOs';
import { LoginResponseDTO } from '../../dtos/AuthDTOs';

// Mock user data
export const mockUserData: User = {
  userId: 'u-1',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  bio: 'A test user',
  joinDate: new Date('2025-01-01T00:00:00Z'),
  role: UserRole.USER,
  deletedAt: null,
  isEmailConfirmed: true,
};

// Mock auth data
export const mockAuthData: Auth = {
  authId: 'a-1',
  email: mockUserData.email,
  hashedPassword: 'hashed-pass',
  userId: mockUserData.userId,
  userByUserId: mockUserData,
  emailConfirmationToken: 'email-token',
  passwordChangeToken: 'change-token',
  passwordChangeExpires: new Date(Date.now() + 3600000), // 1 hour in future
  pendingPasswordHash: 'pending-hash',
  passwordLastModificationTime: new Date(),
};

// Mock signup DTO
export const userSignupDTOData: UserSignupDTO = {
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  password: 'plain-pass',
  joinDate: new Date('2025-01-01T00:00:00Z'),
};

// Mock signin DTO
export const userSigninDTOData: UserSigninDTO = {
  email: 'test@example.com',
  password: 'plain-pass',
};

// Mock User Response DTO (for controller tests)
export const mockUserResponseDTO: UserResponseDTO = {
  userId: 'u-1',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  bio: 'A test user',
  role: UserRole.USER,
  joinDate: new Date('2025-01-01T00:00:00Z'),
  isEmailConfirmed: true,
};

// Mock Login Response DTO
export const mockLoginResponse: LoginResponseDTO = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTEiLCJyb2xlIjoiVVNFUiIsInB3ZGxtb2QiOjE3MzQ0MjI3MzI2NjgsImlhdCI6MTczNDQyMjczMiwiZXhwIjoxNzM0NDI2MzMyfQ.signature',
  user: {
    userId: 'u-1',
    role: UserRole.USER,
  },
};

// Mock Email Confirmation Token (JWT format)
export const mockConfirmationToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzQ0MjI3MzIsImV4cCI6MTczNDQyNjMzMn0.signature';
