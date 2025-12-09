import { AuthRepository } from '../repositories/AuthRepository';
import { Auth } from '../entities/Auth';
import { instanceToPlain } from 'class-transformer';
import {
  UserResponseDTO,
  UserSigninDTO,
  UserSigninResponseDTO,
  UserSignupDTO,
} from '../dtos/UserDTOs';
import { ENV } from '../config/Env';
import bcrypt from 'bcrypt';
import { LoginResponseDTO } from '../dtos/AuthDTOs';
import { JwtPayloadUnsigned } from '../types/AuthTypes';
import { ErrorFactory } from '../errors/ErrorFactory';
import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';
import { UserService } from './UserService';
import {
  buildAuthEntity,
  createJwtUnsignedPayload,
  generateEmailConfirmationToken,
  generateToken,
  verifyEmailConfirmationToken,
  verifyPassword,
} from '../utils/Auth';
import { injectable } from 'tsyringe';
import { logger } from '../config/Logger';
import { sendConfirmationEmail } from '../utils/Mailer';
@injectable()
export class AuthService {
  // private authRepository = new AuthRepository();
  // private userService = new UserService();
  constructor(
    private authRepository: AuthRepository,
    private userService: UserService,
  ) {}

  // // Get auth record by username
  // async getByUsername(username: string): Promise<Auth> {
  //   const auth = await this.authRepository.getByUsername(username);
  //   if (!auth) {
  //     throw ErrorFactory.notFound(`Auth record for username "${username}" not found`);
  //   }
  //   return auth;
  // }

  // Get auth record by email
  async getByEmail(email: string): Promise<Auth> {
    const auth = await this.authRepository.getByEmail(email);
    if (!auth) {
      throw ErrorFactory.notFound(`Auth record for email "${email}" not found`);
    }
    return auth;
  }

  // Create a new auth record
  async createAuth(authData: Partial<Auth>): Promise<Auth> {
    const newAuth = await this.authRepository.createAuth(authData);
    return instanceToPlain(newAuth) as Auth;
  }

  // // Update password by auth ID
  // async updatePassword(authId: string, hashedPassword: string): Promise<void> {
  //   // TODO: will be implemented
  // }

  async signupUser(userData: UserSignupDTO): Promise<UserResponseDTO> {
    const emailExists = await this.userService.doesUserExistByEmail(userData.email);
    logger.debug(`${emailExists} the user with this email exists`);
    if (emailExists) {
      throw ErrorFactory.conflict('A user with this email already exists');
    }

    const usernameExists = await this.userService.doesUserExistByUsername(userData.username);
    logger.debug(`${usernameExists} the user with this username exists`);
    if (usernameExists) {
      throw ErrorFactory.conflict('A user with this username already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password!, ENV.SALT_ROUNDS);

    const newUser = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const userEntity = await this.userService.createUser(userData);
      const savedUser = await transactionalEntityManager.getRepository(User).save(userEntity);
      const authEntity = await this.authRepository.createAuth(
        buildAuthEntity(savedUser, hashedPassword),
      );

      await transactionalEntityManager.getRepository(Auth).save(authEntity);
      const emaiilToken = generateEmailConfirmationToken(savedUser.userId);
      await sendConfirmationEmail(savedUser.email, emaiilToken);
      return savedUser;
    });

    return instanceToPlain(newUser) as UserResponseDTO;
  }

  async login(credentials: UserSigninDTO): Promise<LoginResponseDTO> {
    const auth = await this.authRepository.getByEmail(credentials.email);

    if (!auth) {
      throw ErrorFactory.unauthorized('Missing email or password');
    }

    const passwordMatch = await verifyPassword(credentials.password, auth.hashedPassword);

    if (!passwordMatch) {
      throw ErrorFactory.unauthorized('Invalid email or password');
    }

    const user = auth.userByUserId;
    if (!user) {
      throw ErrorFactory.unauthorized('User record missing');
    }

    if (!user.isEmailConfirmed) {
      throw ErrorFactory.unauthorized('Please confirm your email before logging in');
    }

    const userPayload: JwtPayloadUnsigned = createJwtUnsignedPayload(user);

    const token = generateToken(userPayload);

    return { token, user: userPayload as UserResponseDTO } as UserSigninResponseDTO;
  }

  async confirmEmail(token: string) {
    let userId: string;
    try {
      const payload = verifyEmailConfirmationToken(token);
      userId = payload.userId;
    } catch {
      throw ErrorFactory.badRequest('Invalid or expired email confirmation token');
    }
    await this.userService.confirmUserEmail(userId);
  }
}
