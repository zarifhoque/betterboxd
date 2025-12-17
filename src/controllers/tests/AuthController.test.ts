import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../AuthController';
import { AuthService } from '../../services/AuthService';
import { UserSignupDTO, UserSigninDTO } from '../../dtos/UserDTOs';
import { handleResponse } from '../../utils/Response';
import {
  userSignupDTOData,
  userSigninDTOData,
  mockLoginResponse,
  mockUserResponseDTO,
  mockConfirmationToken,
} from '../../__mocks__/data/Auth';
import { ERROR_DEFINITIONS } from '../../constants/HTTPConstants';

jest.mock('../../services/AuthService');
jest.mock('../../utils/Response');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    authService = new AuthService({} as any, {} as any, {} as any) as jest.Mocked<AuthService>;
    authController = new AuthController(authService);

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('signupUser', () => {
    const signupData: UserSignupDTO = userSignupDTOData;

    it('should signup user successfully', async () => {
      mockRequest.body = signupData;
      authService.signupUser.mockResolvedValue(mockUserResponseDTO);

      await authController.signupUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.signupUser).toHaveBeenCalledWith(signupData);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockUserResponseDTO,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.CREATED.status,
          message: 'User signed up successfully. Please check your email to confirm your account. ',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if signup fails', async () => {
      mockRequest.body = signupData;
      const error = new Error('Email already exists');
      authService.signupUser.mockRejectedValue(error);

      await authController.signupUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.signupUser).toHaveBeenCalledWith(signupData);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if email fails to send', async () => {
      mockRequest.body = signupData;
      const error = new Error('Email Failed to send');
      authService.signupUser.mockRejectedValue(error);

      await authController.signupUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle missing required fields', async () => {
      mockRequest.body = { email: 'test@example.com' }; // Missing other fields
      const error = new Error('Validation error');
      authService.signupUser.mockRejectedValue(error);

      await authController.signupUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('loginUser', () => {
    const loginData: UserSigninDTO = userSigninDTOData;

    it('should login user successfully', async () => {
      mockRequest.body = loginData;
      authService.login.mockResolvedValue(mockLoginResponse);

      await authController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.login).toHaveBeenCalledWith(loginData);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        { token: mockLoginResponse.token, user: mockLoginResponse.user },
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User logged in successfully',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if credentials are invalid', async () => {
      mockRequest.body = loginData;
      const error = new Error('Invalid email or password');
      authService.login.mockRejectedValue(error);

      await authController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.login).toHaveBeenCalledWith(loginData);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if user not found', async () => {
      mockRequest.body = loginData;
      const error = new Error('Missing email or password');
      authService.login.mockRejectedValue(error);

      await authController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should call next with error if email not confirmed', async () => {
      mockRequest.body = loginData;
      const error = new Error('Please confirm your email before logging in');
      authService.login.mockRejectedValue(error);

      await authController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle missing credentials', async () => {
      mockRequest.body = {}; // No credentials
      const error = new Error('Missing email or password');
      authService.login.mockRejectedValue(error);

      await authController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('confirmUser', () => {
    const token = mockConfirmationToken;

    it('should confirm user email successfully', async () => {
      mockRequest.params = { token };
      authService.confirmEmail.mockResolvedValue(undefined);

      await authController.confirmUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.confirmEmail).toHaveBeenCalledWith(token);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        {},
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User confirmed in the backend',
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if token is invalid', async () => {
      mockRequest.params = { token: 'invalid-token' };
      const error = new Error('Token does not match stored token');
      authService.confirmEmail.mockRejectedValue(error);

      await authController.confirmUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(authService.confirmEmail).toHaveBeenCalledWith('invalid-token');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(handleResponse).not.toHaveBeenCalled();
    });

    it('should call next with error if token is expired', async () => {
      mockRequest.params = { token };
      const error = new Error('Token expired');
      authService.confirmEmail.mockRejectedValue(error);

      await authController.confirmUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should call next with error if user not found', async () => {
      mockRequest.params = { token };
      const error = new Error('Auth record for email not found');
      authService.confirmEmail.mockRejectedValue(error);

      await authController.confirmUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle missing token parameter', async () => {
      mockRequest.params = {}; // No token
      const error = new Error('Token is required');
      authService.confirmEmail.mockRejectedValue(error);

      await authController.confirmUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
