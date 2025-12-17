import 'reflect-metadata';
import { AuthService } from '../AuthService';
import { AuthRepository } from '../../repositories/AuthRepository';
import { UserService } from '../UserService';
import { AuthUtils } from '../../utils/AuthUtils';
import { Auth } from '../../entities/Auth';
import { User, UserRole } from '../../entities/User';
import { UserSigninDTO, UserSignupDTO } from '../../dtos/UserDTOs';
import { LoginResponseDTO } from '../../dtos/AuthDTOs';
import { ErrorFactory } from '../../errors/ErrorFactory';
import bcrypt from 'bcrypt';
import * as Mailer from '../../utils/Mailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { passwordResetTokenExpiryMs } from '../../constants/TimeConstants';
import {
  mockUserData,
  mockAuthData,
  userSignupDTOData,
  userSigninDTOData,
} from '../../__mocks__/data/Auth';
import { AppDataSource } from '../../database/DataSource';

jest.mock('../../repositories/AuthRepository');
jest.mock('../UserService');
jest.mock('../../utils/AuthUtils');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('crypto');
jest.mock('../../utils/Mailer', () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordChangeEmail: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../database/DataSource', () => ({
  AppDataSource: {
    manager: {
      transaction: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let userService: jest.Mocked<UserService>;
  const authUtils = {
    verifyPassword: jest.fn(),
    generateToken: jest.fn(),
    createJwtUnsignedPayload: jest.fn(),
    buildAuthEntity: jest.fn(),
    generateEmailConfirmationToken: jest.fn(),
  } as unknown as jest.Mocked<AuthUtils>;

  beforeEach(() => {
    authRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    userService = new UserService({} as any) as jest.Mocked<UserService>;
    authService = new AuthService(authRepository, userService, authUtils);
    (crypto.randomUUID as jest.Mock).mockReturnValue('random-token');
    jest.clearAllMocks();
  });

  describe('getByEmail', () => {
    it('returns auth if found', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuthData);

      const result = await authService.getByEmail(mockAuthData.email);

      expect(result).toEqual(mockAuthData);
      expect(authRepository.getByEmail).toHaveBeenCalledWith(mockAuthData.email);
    });

    it('throws not found if auth does not exist', async () => {
      authRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.getByEmail('missing@example.com')).rejects.toThrow(
        ErrorFactory.notFound('Auth record for email "missing@example.com" not found'),
      );
    });
  });

  describe('createAuth', () => {
    it('creates a new auth record', async () => {
      authRepository.createAuth.mockResolvedValue(mockAuthData);

      const result = await authService.createAuth(mockAuthData);

      expect(result).toEqual(mockAuthData);
      expect(authRepository.createAuth).toHaveBeenCalledWith(mockAuthData);
    });
  });

  describe('requestPasswordChange', () => {
    const userId = mockUserData.userId;
    const currentPassword = 'old-pass';
    const newPassword = 'new-pass';

    it('successfully requests password change', async () => {
      authRepository.getByUserId.mockResolvedValue(mockAuthData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-pass');
      (Mailer.sendPasswordChangeEmail as jest.Mock).mockResolvedValue(true);
      authRepository.updateAuth.mockResolvedValue({
        ...mockAuthData,
        hashedPassword: 'hashed-new-pass',
      });

      await authService.requestPasswordChange(userId, currentPassword, newPassword);

      expect(authRepository.updateAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordChangeToken: 'random-token',
          pendingPasswordHash: 'hashed-new-pass',
        }),
      );
    });

    it('throws unauthorized if current password mismatch', async () => {
      authRepository.getByUserId.mockResolvedValue(mockAuthData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.requestPasswordChange(userId, currentPassword, newPassword),
      ).rejects.toThrow(ErrorFactory.unauthorized('Current password is incorrect'));
    });

    it('throws not found if auth not found', async () => {
      authRepository.getByUserId.mockResolvedValue(null);

      await expect(
        authService.requestPasswordChange(userId, currentPassword, newPassword),
      ).rejects.toThrow(ErrorFactory.notFound('Auth record not found for user'));
    });

    it('throws badGateway if email fails', async () => {
      authRepository.getByUserId.mockResolvedValue(mockAuthData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-pass');
      (Mailer.sendPasswordChangeEmail as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.requestPasswordChange(userId, currentPassword, newPassword),
      ).rejects.toThrow(ErrorFactory.badGateway('Failed to send password change email'));
    });
  });

  describe('confirmPasswordChange', () => {
    const token = 'change-token';

    it('applies pending password successfully', async () => {
      const auth = {
        ...mockAuthData,
        pendingPasswordHash: 'hashed-new-pass',
        passwordChangeExpires: new Date(Date.now() + 1000),
      };
      authRepository.findByPasswordChangeToken.mockResolvedValue(auth);
      authRepository.updateAuth.mockResolvedValue(auth);

      await authService.confirmPasswordChange(token);

      expect(authRepository.updateAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          hashedPassword: 'hashed-new-pass',
          passwordChangeToken: null,
          pendingPasswordHash: null,
        }),
      );
    });

    it('throws not found if token invalid', async () => {
      authRepository.findByPasswordChangeToken.mockResolvedValue(null);

      await expect(authService.confirmPasswordChange(token)).rejects.toThrow(
        ErrorFactory.notFound('Invalid password change token'),
      );
    });

    it('throws badRequest if token expired', async () => {
      const auth = {
        ...mockAuthData,
        pendingPasswordHash: 'hash',
        passwordChangeExpires: new Date(Date.now() - 1000),
      };
      authRepository.findByPasswordChangeToken.mockResolvedValue(auth);

      await expect(authService.confirmPasswordChange(token)).rejects.toThrow(
        ErrorFactory.badRequest('Token expired'),
      );
    });

    it('throws badRequest if no pending password', async () => {
      const auth = {
        ...mockAuthData,
        pendingPasswordHash: null,
        passwordChangeExpires: new Date(Date.now() + 1000),
      };
      authRepository.findByPasswordChangeToken.mockResolvedValue(auth);

      await expect(authService.confirmPasswordChange(token)).rejects.toThrow(
        ErrorFactory.badRequest('No pending password to apply'),
      );
    });
  });

  describe('getAuthByUserId', () => {
    it('returns auth if exists', async () => {
      authRepository.getByUserId.mockResolvedValue(mockAuthData);

      const result = await authService.getAuthByUserId(mockUserData.userId);

      expect(result).toEqual(mockAuthData);
    });

    it('returns null if not found', async () => {
      authRepository.getByUserId.mockResolvedValue(null);

      const result = await authService.getAuthByUserId(mockUserData.userId);

      expect(result).toBeNull();
    });
  });

  describe('getStoredConfirmationToken', () => {
    it('returns token if exists', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuthData);

      const token = await authService.getStoredConfirmationToken(mockAuthData.email);
      expect(token).toBe(mockAuthData.emailConfirmationToken);
    });

    it('throws not found if auth not exists', async () => {
      authRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.getStoredConfirmationToken('missing@example.com')).rejects.toThrow(
        ErrorFactory.notFound('Auth record for email "missing@example.com" not found'),
      );
    });
  });

  describe('signupUser', () => {
    const userDTO: UserSignupDTO = userSignupDTOData;

    it('creates user and sends confirmation email', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      authUtils.generateEmailConfirmationToken.mockReturnValue('email-token');
      (Mailer.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);
      userService.createUser.mockResolvedValue(mockUserData);
      authRepository.createAuth.mockResolvedValue(mockAuthData);

      // Mock the transaction to execute the callback immediately
      (AppDataSource.manager.transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const mockEntityManager = {
          getRepository: jest.fn().mockReturnValue({
            save: jest.fn().mockResolvedValue(mockUserData),
          }),
        };
        return callback(mockEntityManager);
      });

      const result = await authService.signupUser(userDTO);

      expect(result).toMatchObject({ userId: mockUserData.userId });
      expect(userService.createUser).toHaveBeenCalledWith(userDTO);
      expect(authRepository.createAuth).toHaveBeenCalled();
      expect(Mailer.sendConfirmationEmail).toHaveBeenCalledWith(userDTO.email, 'email-token');
    });

    it('throws badGateway if email fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      authUtils.generateEmailConfirmationToken.mockReturnValue('email-token');
      (Mailer.sendConfirmationEmail as jest.Mock).mockResolvedValue(false);

      await expect(authService.signupUser(userDTO)).rejects.toThrow(
        ErrorFactory.badGateway('Email Failed to send'),
      );
    });
  });

  describe('login', () => {
    const credentials: UserSigninDTO = userSigninDTOData;

    it('returns login response with token', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuthData);
      authUtils.verifyPassword.mockResolvedValue(true);
      authUtils.createJwtUnsignedPayload.mockResolvedValue({
        userId: mockUserData.userId,
        role: UserRole.USER,
        pwdlmod: Date.now(),
      });
      authUtils.generateToken.mockReturnValue('jwt-token');

      const result = await authService.login(credentials);

      expect(result.token).toBe('jwt-token');
      expect(result.user.userId).toBe(mockUserData.userId);
    });
    it('handles null passwordLastModificationTime', async () => {
      authRepository.getByEmail.mockResolvedValue({
        ...mockAuthData,
        passwordLastModificationTime: undefined as any,
      });
      authUtils.verifyPassword.mockResolvedValue(true);
      authUtils.createJwtUnsignedPayload.mockResolvedValue({
        userId: mockUserData.userId,
        role: UserRole.USER,
        pwdlmod: 0,
      });
      authUtils.generateToken.mockReturnValue('jwt-token');

      const result = await authService.login(credentials);

      expect(authUtils.createJwtUnsignedPayload).toHaveBeenCalledWith(
        mockUserData,
        0, // Should be called with 0 when passwordLastModificationTime is null
      );
      expect(result.token).toBe('jwt-token');
    });

    it('throws if auth not found', async () => {
      authRepository.getByEmail.mockResolvedValue(null);
      await expect(authService.login(credentials)).rejects.toThrow(
        ErrorFactory.unauthenticated('Missing email or password'),
      );
    });

    it('throws if password invalid', async () => {
      authRepository.getByEmail.mockResolvedValue(mockAuthData);
      authUtils.verifyPassword.mockResolvedValue(false);

      await expect(authService.login(credentials)).rejects.toThrow(
        ErrorFactory.unauthenticated('Invalid email or password'),
      );
    });

    it('throws if user not found', async () => {
      authRepository.getByEmail.mockResolvedValue({ ...mockAuthData, userByUserId: null as any });
      authUtils.verifyPassword.mockResolvedValue(true);

      await expect(authService.login(credentials)).rejects.toThrow(
        ErrorFactory.unauthenticated('User record missing'),
      );
    });

    it('throws if email not confirmed', async () => {
      authRepository.getByEmail.mockResolvedValue({
        ...mockAuthData,
        userByUserId: { ...mockUserData, isEmailConfirmed: false },
      });
      authUtils.verifyPassword.mockResolvedValue(true);

      await expect(authService.login(credentials)).rejects.toThrow(
        ErrorFactory.unauthenticated('Please confirm your email before logging in'),
      );
    });
  });

  describe('confirmEmail', () => {
    const token = 'jwt-token';
    const payload = { email: mockUserData.email };

    it('successfully confirms email', async () => {
      const token = 'jwt-token'; // This is already defined above
      const payload = { email: mockUserData.email };

      (jwt.verify as jest.Mock).mockReturnValue(payload);
      authRepository.getByEmail.mockResolvedValue({
        ...mockAuthData,
        emailConfirmationToken: token, // Store the JWT token, not 'email-token'
      });
      userService.confirmUserEmailByEmail.mockResolvedValue(undefined);

      await authService.confirmEmail(token);

      expect(userService.confirmUserEmailByEmail).toHaveBeenCalledWith(payload.email);
    });

    it('throws if token does not match stored', async () => {
      (jwt.verify as jest.Mock).mockReturnValue(payload);
      authRepository.getByEmail.mockResolvedValue({
        ...mockAuthData,
        emailConfirmationToken: 'other-token',
      });

      await expect(authService.confirmEmail(token)).rejects.toThrow(
        'Token does not match stored token',
      );
    });

    it('throws if auth not found', async () => {
      (jwt.verify as jest.Mock).mockReturnValue(payload);
      authRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.confirmEmail(token)).rejects.toThrow(
        ErrorFactory.notFound(`Auth record for email "${payload.email}" not found`),
      );
    });
  });
});
