import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { UserController } from '../UserController';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';
import { UserUpdateDTO } from '../../dtos/UserDTOs';
import { AuthRequest } from '../../types/AuthTypes';
import { UserRole } from '../../entities/User';
import {
  mockUserJwtPayload,
  mockUserResponseDTO,
  mockUsersArray,
  UserUpdateDTOData,
} from '../../__mocks__/data/User';
import { handleResponse } from '../../utils/Response';
import { ERROR_DEFINITIONS } from '../../constants/HTTPConstants';
import { validPaginationCases } from '../../__mocks__/data/General';

jest.mock('../../services/UserService');
jest.mock('../../services/AuthService');
jest.mock('../../utils/Response');

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  let authService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockAuthRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    userService = new UserService({} as any) as jest.Mocked<UserService>;
    authService = new AuthService({} as any, {} as any, {} as any) as jest.Mocked<AuthService>;
    userController = new UserController(userService, authService);

    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    mockAuthRequest = {
      params: {},
      query: {},
      body: {},
      user: mockUserJwtPayload,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    const validPaginationCasesData = validPaginationCases;
    it('should fetch all users successfully', async () => {
      const queryParams = { page: 1, itemsPerPage: 10 };
      mockRequest.query = queryParams as any;
      userService.getAllUsers.mockResolvedValue(mockUsersArray);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalledWith(queryParams);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockUsersArray,
        expect.objectContaining({
          status: 200,
          message: 'Users fetched succesfully',
        }),
      );
    });

    validPaginationCases.forEach(({ query, desc }) => {
      it(`should fetch users successfully with pagination: ${desc}`, async () => {
        mockRequest.query = query as any;
        userService.getAllUsers.mockResolvedValue(mockUsersArray);

        await userController.getAllUsers(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );

        expect(userService.getAllUsers).toHaveBeenCalledWith(query);
        expect(handleResponse).toHaveBeenCalledWith(
          mockResponse,
          mockUsersArray,
          expect.objectContaining({
            status: ERROR_DEFINITIONS.OK.status,
            message: 'Users fetched succesfully',
          }),
        );
      });
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Database error');
      userService.getAllUsers.mockRejectedValue(error);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    const queriedUserId = '550e8400-e29b-41d4-a716-446655440001';

    it('should fetch user by id successfully', async () => {
      mockRequest.params = { id: queriedUserId };
      userService.getUserById.mockResolvedValue(mockUserResponseDTO);

      await userController.getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.getUserById).toHaveBeenCalledWith(queriedUserId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockUserResponseDTO,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User fetched succesfully',
        }),
      );
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };

      await userController.getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(userService.getUserById).not.toHaveBeenCalled();
    });

    it('should call next with error if user not found', async () => {
      mockRequest.params = { id: queriedUserId };
      const error = new Error('User not found');
      userService.getUserById.mockRejectedValue(error);

      await userController.getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser', () => {
    const queriedUserId = '550e8400-e29b-41d4-a716-446655440001';
    const updateData: UserUpdateDTO = UserUpdateDTOData;

    it('should update user successfully', async () => {
      mockRequest.params = { id: queriedUserId };
      mockRequest.body = updateData;
      const updatedUser = { ...mockUserResponseDTO, ...updateData };
      userService.updateUser.mockResolvedValue(updatedUser);

      await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.updateUser).toHaveBeenCalledWith(queriedUserId, updateData);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        updatedUser,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User updated successfully',
        }),
      );
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };
      mockRequest.body = updateData;

      await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should call next with error if update fails', async () => {
      mockRequest.params = { id: queriedUserId };
      mockRequest.body = updateData;
      const error = new Error('Update failed');
      userService.updateUser.mockRejectedValue(error);

      await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deactivateUser', () => {
    const queriedUserId = '550e8400-e29b-41d4-a716-446655440001';

    it('should deactivate user successfully', async () => {
      mockRequest.params = { id: queriedUserId };
      userService.deactivateUser.mockResolvedValue(undefined);

      await userController.deactivateUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(userService.deactivateUser).toHaveBeenCalledWith(queriedUserId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User deleted successfully',
        }),
      );
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };

      await userController.deactivateUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
      expect(userService.deactivateUser).not.toHaveBeenCalled();
    });

    it('should call next with error if deactivation fails', async () => {
      mockRequest.params = { id: queriedUserId };
      const error = new Error('User not found');
      userService.deactivateUser.mockRejectedValue(error);

      await userController.deactivateUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateRole', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';

    it('should update user role successfully', async () => {
      mockRequest.params = { id: userId };
      mockRequest.body = { role: UserRole.ADMIN };
      const updatedUser = { ...mockUserResponseDTO, role: UserRole.ADMIN };
      userService.updateUserRole.mockResolvedValue(updatedUser as any);

      await userController.updateRole(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.updateUserRole).toHaveBeenCalledWith(userId, UserRole.ADMIN);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        updatedUser,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User role updated successfully',
        }),
      );
    });

    it('should return bad request if role is not provided', async () => {
      mockRequest.params = { id: userId };
      mockRequest.body = {};

      await userController.updateRole(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        status: 400,
        message: 'Role must be provided',
      });
      expect(userService.updateUserRole).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid UUID', async () => {
      mockRequest.params = { id: 'invalid-uuid' };
      mockRequest.body = { role: UserRole.ADMIN };

      await userController.updateRole(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(userService.updateUserRole).not.toHaveBeenCalled();
    });

    it('should call next with error if role update fails', async () => {
      mockRequest.params = { id: userId };
      mockRequest.body = { role: UserRole.ADMIN };
      const error = new Error('User not found');
      userService.updateUserRole.mockRejectedValue(error);

      await userController.updateRole(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('changePasswordRequest', () => {
    const queriedUserId = '550e8400-e29b-41d4-a716-446655440001';
    const passwordData = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
    };

    it('should request password change successfully', async () => {
      mockAuthRequest.body = passwordData;
      authService.requestPasswordChange.mockResolvedValue(undefined);

      await userController.changePasswordRequest(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
      );

      expect(authService.requestPasswordChange).toHaveBeenCalledWith(
        queriedUserId,
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        message: 'Confirmation code sent to email',
      });
    });

    it('should throw error if password change request fails', async () => {
      mockAuthRequest.body = passwordData;
      const error = new Error('Current password incorrect');
      authService.requestPasswordChange.mockRejectedValue(error);

      await expect(
        userController.changePasswordRequest(
          mockAuthRequest as AuthRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Current password incorrect');
    });
  });

  describe('changePasswordConfirm', () => {
    const token = 'change-token-123';

    it('should confirm password change successfully', async () => {
      mockRequest.body = { token };
      authService.confirmPasswordChange.mockResolvedValue(undefined);

      await userController.changePasswordConfirm(mockRequest as Request, mockResponse as Response);

      expect(authService.confirmPasswordChange).toHaveBeenCalledWith(token);
      expect(handleResponse).toHaveBeenCalledWith(mockResponse, null, {
        message: 'Password updated successfully',
      });
    });

    it('should throw error if token is invalid', async () => {
      mockRequest.body = { token };
      const error = new Error('Invalid token');
      authService.confirmPasswordChange.mockRejectedValue(error);

      await expect(
        userController.changePasswordConfirm(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow('Invalid token');
    });
  });

  describe('getProfile', () => {
    const queriedUserId = '550e8400-e29b-41d4-a716-446655440001';

    it('should get user profile successfully', async () => {
      userService.getUserById.mockResolvedValue(mockUserResponseDTO);

      await userController.getProfile(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(userService.getUserById).toHaveBeenCalledWith(queriedUserId);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        mockUserResponseDTO,
        expect.objectContaining({
          status: ERROR_DEFINITIONS.OK.status,
          message: 'User fetched succesfully',
        }),
      );
    });

    it('should call next with error if profile fetch fails', async () => {
      const error = new Error('User not found');
      userService.getUserById.mockRejectedValue(error);

      await userController.getProfile(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateProfile', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    const updateData: UserUpdateDTO = {
      name: 'Updated Profile Name',
      bio: 'Updated profile bio',
    };

    it('should update user profile successfully', async () => {
      mockAuthRequest.body = updateData;
      const updatedUser = { ...mockUserResponseDTO, ...updateData };
      userService.updateUser.mockResolvedValue(updatedUser);

      await userController.updateProfile(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(handleResponse).toHaveBeenCalledWith(
        mockResponse,
        updatedUser,
        expect.objectContaining({
          status: 200,
          message: 'User updated successfully',
        }),
      );
    });

    it('should call next with error if profile update fails', async () => {
      mockAuthRequest.body = updateData;
      const error = new Error('Update failed');
      userService.updateUser.mockRejectedValue(error);

      await userController.updateProfile(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
