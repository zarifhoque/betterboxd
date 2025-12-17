import { UserService } from '../UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { UserRole } from '../../entities/User';
import { UserUpdateDTO } from '../../dtos/UserDTOs';
import { ErrorFactory } from '../../errors/ErrorFactory';
import {
  firstMockUserData,
  secondMockUserData,
  userCreateDTOData,
} from '../../__mocks__/data/User';

jest.mock('../../repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  const mockUserData = firstMockUserData;
  const mockUsersData = [firstMockUserData, secondMockUserData];

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
    jest.clearAllMocks();
  });
  describe('getAllUsers', () => {
    it('should return all users as UserResponseDTO[]', async () => {
      const mockUsers = mockUsersData;
      userRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers({});

      expect(result).toEqual(
        mockUsers.map((user) => expect.objectContaining({ userId: user.userId })),
      );
      expect(userRepository.getAllUsers).toHaveBeenCalledWith({});
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const queriedUserId = mockUserData.userId;
      userRepository.getUserById.mockResolvedValue(mockUserData);

      const result = await userService.getUserById(queriedUserId);

      expect(result).toMatchObject(mockUserData);
      expect(userRepository.getUserById).toHaveBeenCalledWith(queriedUserId);
    });

    it('should throw not found error if user not found', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(userService.getUserById(mockUserData.userId)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUserData.userId} not found`),
      );
    });
  });

  describe('createUser', () => {
    const createDTO = userCreateDTOData;
    it('should create a new user if email and username are free', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.getUserByUsername.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue({ ...mockUserData, isEmailConfirmed: false });

      const result = await userService.createUser(createDTO);

      expect(result.isEmailConfirmed).toBe(false);
      expect(userRepository.createUser).toHaveBeenCalledWith(createDTO);
    });

    it('should throw conflict if email exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUserData);

      await expect(userService.createUser(createDTO)).rejects.toThrow(
        ErrorFactory.conflict('A user with this email already exists'),
      );
    });

    it('should throw conflict if username exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.getUserByUsername.mockResolvedValue(mockUserData);

      await expect(userService.createUser(createDTO)).rejects.toThrow(
        ErrorFactory.conflict('A user with this username already exists'),
      );
    });
  });

  describe('updateUser', () => {
    const updateDTO: UserUpdateDTO = {
      username: 'updatedUser',
      name: 'Updated Name',
      bio: 'Updated bio',
    };
    const queriedUserId = mockUserData.userId;

    it('should update user successfully if exist', async () => {
      const updatedUser = { ...mockUserData, ...updateDTO };
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(queriedUserId, updateDTO);

      expect(result).toMatchObject({
        userId: mockUserData.userId,
        username: updateDTO.username,
        name: updateDTO.name,
        bio: updateDTO.bio,
        email: mockUserData.email,
        role: mockUserData.role,
        joinDate: mockUserData.joinDate,
        isEmailConfirmed: mockUserData.isEmailConfirmed,
      });

      expect(userRepository.updateUser).toHaveBeenCalledWith(queriedUserId, updateDTO);
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.updateUser.mockResolvedValue(null);

      await expect(userService.updateUser(mockUserData.userId, updateDTO)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUserData.userId} not found`),
      );
    });
  });

  describe('deactivateUser', () => {
    const queriedUserId = mockUserData.userId;
    it('should soft delete user', async () => {
      userRepository.softDeleteUser.mockResolvedValue(true);

      await userService.deactivateUser(queriedUserId);

      expect(userRepository.softDeleteUser).toHaveBeenCalledWith(queriedUserId);
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.softDeleteUser.mockResolvedValue(false);

      await expect(userService.deactivateUser(queriedUserId)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUserData.userId} not found`),
      );
    });
  });

  describe('doesUserExistByEmail', () => {
    const queriedEmail = mockUserData.email;
    it('returns true if user exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUserData);

      const exists = await userService.doesUserExistByEmail(queriedEmail);

      expect(exists).toBe(true);
    });

    it('returns false if user does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      const exists = await userService.doesUserExistByEmail(queriedEmail);

      expect(exists).toBe(false);
    });
  });

  describe('doesUserExistByUsername', () => {
    const queriedUsername = mockUserData.username;
    it('returns true if user exists', async () => {
      userRepository.getUserByUsername.mockResolvedValue(mockUserData);

      const exists = await userService.doesUserExistByUsername(queriedUsername);

      expect(exists).toBe(true);
    });

    it('returns false if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);

      const exists = await userService.doesUserExistByUsername(queriedUsername);

      expect(exists).toBe(false);
    });
  });

  describe('updateUserRole', () => {
    const newRole = UserRole.ADMIN;
    const queriedUserId = mockUserData.userId;
    it('should update user role successfully', async () => {
      const updatedUser = { ...mockUserData, role: newRole };
      userRepository.getUserById.mockResolvedValue(mockUserData);
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUserRole(queriedUserId, newRole);
      expect(result.role).toBe(newRole);
      expect(userRepository.updateUser).toHaveBeenCalledWith(queriedUserId, {
        ...mockUserData,
        role: newRole,
      });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(userService.updateUserRole(queriedUserId, newRole)).rejects.toThrow(
        ErrorFactory.notFound(`User with id ${queriedUserId} not found`),
      );
    });
  });

  describe('confirmUserEmailByEmail', () => {
    const queriedEmail = mockUserData.email;
    const queriedUserId = mockUserData.userId;
    it('should confirm user email if not already confirmed', async () => {
      const unconfirmedUser = { ...mockUserData, isEmailConfirmed: false };
      userRepository.getUserByEmail.mockResolvedValue(unconfirmedUser);
      userRepository.updateUser.mockResolvedValue({ ...unconfirmedUser, isEmailConfirmed: true });

      await userService.confirmUserEmailByEmail(queriedEmail);

      expect(userRepository.updateUser).toHaveBeenCalledWith(queriedUserId, {
        ...unconfirmedUser,
        isEmailConfirmed: true,
      });
    });

    it('should do nothing if user email is already confirmed', async () => {
      const confirmedUser = { ...mockUserData, isEmailConfirmed: true };
      userRepository.getUserByEmail.mockResolvedValue(confirmedUser);

      await userService.confirmUserEmailByEmail(queriedEmail);

      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });

    it('should throw not found if email does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(userService.confirmUserEmailByEmail(queriedEmail)).rejects.toThrow(
        ErrorFactory.notFound(`User with email ${queriedEmail} not found`),
      );
    });
  });
  describe('findUserByEmail', () => {
    const queriedEmail = mockUserData.email;
    it('should return user if found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUserData);

      const result = await userService.findUserByEmail(queriedEmail);
      expect(result).toMatchObject({ userId: mockUserData.userId });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(userService.findUserByEmail(queriedEmail)).rejects.toThrow(
        ErrorFactory.notFound(`User with email ${queriedEmail} not found`),
      );
    });
  });
  describe('findUserByUsername', () => {
    const queriedUsername = mockUserData.username;
    const receivedUserId = mockUserData.userId;
    it('should return user if found', async () => {
      userRepository.getUserByUsername.mockResolvedValue(mockUserData);

      const result = await userService.findUserByUsername(queriedUsername);
      expect(result).toMatchObject({ userId: receivedUserId });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);

      await expect(userService.findUserByUsername(queriedUsername)).rejects.toThrow(
        ErrorFactory.notFound(`User with username ${queriedUsername} not found`),
      );
    });
  });
});
