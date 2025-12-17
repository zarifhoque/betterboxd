import 'reflect-metadata';
import { AuthService } from '../AuthService';
import { AuthRepository } from '../../repositories/AuthRepository';
import { UserService } from '../UserService';
import { AuthUtils } from '../../utils/AuthUtils';
import { Auth } from '../../entities/Auth';
import { User, UserRole } from '../../entities/User';
import { UserSigninDTO, UserSignupDTO } from '../../dtos/UserDTOs';
import { ErrorFactory } from '../../errors/ErrorFactory';
import bcrypt from 'bcrypt';
import * as Mailer from '../../utils/Mailer';
import jwt from 'jsonwebtoken';

jest.mock('../../repositories/AuthRepository');
jest.mock('../UserService');
jest.mock('../../utils/AuthUtils');
jest.mock('../../utils/Mailer');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let userService: jest.Mocked<UserService>;
  let authUtils: jest.Mocked<AuthUtils>;

  const mockUser: User = {
    userId: 'u-1',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    bio: 'A bio',
    role: UserRole.USER,
    joinDate: new Date(),
    deletedAt: null,
    isEmailConfirmed: true,
  };

  const mockAuth: Auth = {
    authId: 'a-1',
    email: 'test@example.com',
    hashedPassword: 'hashed-pass',
    userId: 'u-1',
    userByUserId: mockUser,
    emailConfirmationToken: 'token-123',
    passwordChangeToken: null,
    passwordChangeExpires: null,
    pendingPasswordHash: null,
    passwordLastModificationTime: new Date(),
  };

  beforeEach(() => {
    authRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    userService = new UserService({} as any) as jest.Mocked<UserService>;
    authUtils = new AuthUtils() as jest.Mocked<AuthUtils>;

    authService = new AuthService(authRepository, userService, authUtils);
    jest.clearAllMocks();
  });

  describe('getByEmail', () => {
    it('returns auth if found', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuth);

      const result = await authService.getByEmail('test@example.com');

      expect(result).toEqual(mockAuth);
      expect(authRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('throws not found if auth does not exist', async () => {
      authRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.getByEmail('missing@example.com')).rejects.toThrow(
        ErrorFactory.notFound('Auth record for email "missing@example.com" not found'),
      );
    });
  });

  describe('createAuth', () => {
    it('creates and returns auth', async () => {
      authRepository.createAuth.mockResolvedValue(mockAuth);

      const result = await authService.createAuth({ email: 'test@example.com' });

      expect(result).toEqual(mockAuth);
      expect(authRepository.createAuth).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('getAuthByUserId', () => {
    it('returns auth by userId', async () => {
      authRepository.getByUserId.mockResolvedValue(mockAuth);

      const result = await authService.getAuthByUserId('u-1');

      expect(result).toEqual(mockAuth);
      expect(authRepository.getByUserId).toHaveBeenCalledWith('u-1');
    });
  });

  describe('getStoredConfirmationToken', () => {
    it('returns token if auth exists', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuth);

      const token = await authService.getStoredConfirmationToken('test@example.com');
      expect(token).toBe('token-123');
    });

    it('throws if auth does not exist', async () => {
      authRepository.getByEmail.mockResolvedValue(null);
      await expect(authService.getStoredConfirmationToken('missing@example.com')).rejects.toThrow(
        ErrorFactory.notFound('Auth record for email "missing@example.com" not found'),
      );
    });
  });

  describe('signupUser', () => {
    it('creates user and auth, sends email', async () => {
      const signupData: UserSignupDTO = {
        email: 'test@example.com',
        password: 'pass123',
        username: 'testuser',
        name: 'Test',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      authUtils.generateEmailConfirmationToken.mockReturnValue('email-token');
      (Mailer.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);
      userService.createUser.mockResolvedValue(mockUser);
      authRepository.createAuth.mockResolvedValue(mockAuth);
      const transactionMock = jest.fn().mockImplementation(async (cb: any) =>
        cb({
          getRepository: () => ({ save: jest.fn().mockResolvedValue(mockUser) }),
        }),
      );
      // @ts-expect-error -- Ignore --
      authService['AppDataSource'] = { manager: { transaction: transactionMock } };

      const result = await authService.signupUser(signupData);

      expect(result).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith(signupData);
      expect(authRepository.createAuth).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns login response with token', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuth);
      authUtils.verifyPassword.mockResolvedValue(true);
      authUtils.createJwtUnsignedPayload.mockResolvedValue({
        userId: 'u-1',
        role: UserRole.USER,
        pwdlmod: 0,
      });
      authUtils.generateToken.mockReturnValue('jwt-token');

      const credentials: UserSigninDTO = { email: 'test@example.com', password: 'pass123' };
      const result = await authService.login(credentials);

      expect(result).toEqual({
        token: 'jwt-token',
        user: { userId: 'u-1', role: UserRole.USER, pwdlmod: 0 },
      });
    });

    it('throws if password does not match', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuth);
      authUtils.verifyPassword.mockResolvedValue(false);
      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(ErrorFactory.unauthenticated('Invalid email or password'));
    });
  });

  describe('confirmEmail', () => {
    it('confirms user email', async () => {
      const token = 'jwt-token';
      (jwt.verify as jest.Mock).mockReturnValue({ email: 'test@example.com' });
      authRepository.getByEmail.mockResolvedValue(mockAuth);
      const spy = jest.spyOn(userService, 'confirmUserEmailByEmail').mockResolvedValue();

      await authService.confirmEmail(token);

      expect(spy).toHaveBeenCalledWith('test@example.com');
    });

    it('throws if token mismatch', async () => {
      const token = 'jwt-token';
      (jwt.verify as jest.Mock).mockReturnValue({ email: 'test@example.com' });
      authRepository.getByEmail.mockResolvedValue({ ...mockAuth, emailConfirmationToken: 'other' });

      await expect(authService.confirmEmail(token)).rejects.toThrow(
        'Token does not match stored token',
      );
    });
  });
});
