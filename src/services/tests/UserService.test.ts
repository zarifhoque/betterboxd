import { UserService } from '../UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { User, UserRole } from '../../entities/User';
import { UserCreateDTO, UserUpdateDTO } from '../../dtos/UserDTOs';
import { ErrorFactory } from '../../errors/ErrorFactory';

jest.mock('../../repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser: User = {
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

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
    jest.clearAllMocks();
  });
  describe('getAllUsers', () => {
    it('should return all users as UserResponseDTO[]', async () => {
      const mockUsers = [mockUser];
      userRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers({});

      expect(result).toEqual(mockUsers.map((u) => expect.objectContaining({ userId: u.userId })));
      expect(userRepository.getAllUsers).toHaveBeenCalledWith({});
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser.userId);

      expect(result).toMatchObject(mockUser);
      expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.userId);
    });

    it('should throw not found error if user not found', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(userService.getUserById(mockUser.userId)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUser.userId} not found`),
      );
    });
  });

  describe('createUser', () => {
    const createDTO: UserCreateDTO = {
      username: mockUser.username,
      name: mockUser.name,
      email: mockUser.email,
      bio: mockUser.bio,
    };

    it('should create a new user if email and username are free', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.getUserByUsername.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue({ ...mockUser, isEmailConfirmed: false });

      const result = await userService.createUser(createDTO);

      expect(result.isEmailConfirmed).toBe(false);
      expect(userRepository.createUser).toHaveBeenCalledWith(createDTO);
    });

    it('should throw conflict if email exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      await expect(userService.createUser(createDTO)).rejects.toThrow(
        ErrorFactory.conflict('A user with this email already exists'),
      );
    });

    it('should throw conflict if username exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.getUserByUsername.mockResolvedValue(mockUser);

      await expect(userService.createUser(createDTO)).rejects.toThrow(
        ErrorFactory.conflict('A user with this username already exists'),
      );
    });
  });

  describe('updateUser', () => {
    const updateDTO: UserUpdateDTO = { bio: 'Updated bio' };

    it('should update user successfully', async () => {
      userRepository.updateUser.mockResolvedValue({ ...mockUser, ...updateDTO });

      const result = await userService.updateUser(mockUser.userId, updateDTO);

      expect(result).toMatchObject({ ...mockUser, ...updateDTO });
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser.userId, updateDTO);
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.updateUser.mockResolvedValue(null);

      await expect(userService.updateUser(mockUser.userId, updateDTO)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUser.userId} not found`),
      );
    });
  });

  describe('deactivateUser', () => {
    it('should soft delete user', async () => {
      userRepository.softDeleteUser.mockResolvedValue(true);

      await userService.deactivateUser(mockUser.userId);

      expect(userRepository.softDeleteUser).toHaveBeenCalledWith(mockUser.userId);
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.softDeleteUser.mockResolvedValue(false);

      await expect(userService.deactivateUser(mockUser.userId)).rejects.toThrow(
        ErrorFactory.notFound(`User with the id ${mockUser.userId} not found`),
      );
    });
  });

  describe('doesUserExistByEmail', () => {
    it('returns true if user exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      const exists = await userService.doesUserExistByEmail(mockUser.email);

      expect(exists).toBe(true);
    });

    it('returns false if user does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      const exists = await userService.doesUserExistByEmail(mockUser.email);

      expect(exists).toBe(false);
    });
  });

  describe('doesUserExistByUsername', () => {
    it('returns true if user exists', async () => {
      userRepository.getUserByUsername.mockResolvedValue(mockUser);

      const exists = await userService.doesUserExistByUsername(mockUser.username);

      expect(exists).toBe(true);
    });

    it('returns false if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);

      const exists = await userService.doesUserExistByUsername(mockUser.username);

      expect(exists).toBe(false);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const updatedUser = { ...mockUser, role: UserRole.ADMIN };
      userRepository.getUserById.mockResolvedValue(mockUser);
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUserRole(mockUser.userId, UserRole.ADMIN);

      expect(result.role).toBe(UserRole.ADMIN);
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser.userId, {
        ...mockUser,
        role: UserRole.ADMIN,
      });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(userService.updateUserRole(mockUser.userId, UserRole.ADMIN)).rejects.toThrow(
        ErrorFactory.notFound(`User with id ${mockUser.userId} not found`),
      );
    });
  });

  describe('confirmUserEmailByEmail', () => {
    it('should confirm user email if not already confirmed', async () => {
      const unconfirmedUser = { ...mockUser, isEmailConfirmed: false };
      userRepository.getUserByEmail.mockResolvedValue(unconfirmedUser);
      userRepository.updateUser.mockResolvedValue({ ...unconfirmedUser, isEmailConfirmed: true });

      await userService.confirmUserEmailByEmail(mockUser.email);

      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser.userId, {
        ...unconfirmedUser,
        isEmailConfirmed: true,
      });
    });

    it('should do nothing if user email is already confirmed', async () => {
      const confirmedUser = { ...mockUser, isEmailConfirmed: true };
      userRepository.getUserByEmail.mockResolvedValue(confirmedUser);

      await userService.confirmUserEmailByEmail(mockUser.email);

      expect(userRepository.updateUser).not.toHaveBeenCalled();
    });

    it('should throw not found if email does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(userService.confirmUserEmailByEmail(mockUser.email)).rejects.toThrow(
        ErrorFactory.notFound(`User with email ${mockUser.email} not found`),
      );
    });
  });
  describe('findUserByEmail', () => {
    it('should return user if found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail(mockUser.email);
      expect(result).toMatchObject({ userId: mockUser.userId });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(userService.findUserByEmail(mockUser.email)).rejects.toThrow(
        ErrorFactory.notFound(`User with email ${mockUser.email} not found`),
      );
    });
  });
  describe('findUserByUsername', () => {
    it('should return user if found', async () => {
      userRepository.getUserByUsername.mockResolvedValue(mockUser);

      const result = await userService.findUserByUsername(mockUser.username);
      expect(result).toMatchObject({ userId: mockUser.userId });
    });

    it('should throw not found if user does not exist', async () => {
      userRepository.getUserByUsername.mockResolvedValue(null);

      await expect(userService.findUserByUsername(mockUser.username)).rejects.toThrow(
        ErrorFactory.notFound(`User with username ${mockUser.username} not found`),
      );
    });
  });
});
