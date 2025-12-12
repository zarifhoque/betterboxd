import { AuthRepository } from '../repositories/AuthRepository';
import { Auth } from '../entities/Auth';
import { instanceToPlain } from 'class-transformer';
import { UserResponseDTO, UserSessionDTO, UserSigninDTO, UserSignupDTO } from '../dtos/UserDTOs';
import { ENV } from '../config/Env';
import bcrypt from 'bcrypt';
import { LoginResponseDTO } from '../dtos/AuthDTOs';
import { JwtPayloadUnsigned } from '../types/AuthTypes';
import { ErrorFactory } from '../errors/ErrorFactory';
import { AppDataSource } from '../database/DataSource';
import { User } from '../entities/User';
import { UserService } from './UserService';
import { injectable } from 'tsyringe';
import { sendConfirmationEmail } from '../utils/Mailer';
import { AuthUtils } from '../utils/AuthUtils';
import jwt from 'jsonwebtoken';
@injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userService: UserService,
    private authUtils: AuthUtils,
  ) {}

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

  async getStoredConfirmationToken(email: string): Promise<string | null> {
    const auth = await this.authRepository.getByEmail(email);
    if (!auth) {
      throw ErrorFactory.notFound(`Auth record for email "${email}" not found`);
    }
    return auth.emailConfirmationToken;
  }

  async signupUser(userData: UserSignupDTO): Promise<UserResponseDTO> {
    const hashedPassword = await bcrypt.hash(userData.password!, ENV.SALT_ROUNDS);
    const emailToken = this.authUtils.generateEmailConfirmationToken(userData.email);
    const mailSent = await sendConfirmationEmail(userData.email, emailToken);
    if (!mailSent) {
      throw ErrorFactory.badGateway('Email Failed to send');
    }

    const newUser = await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const userEntity = await this.userService.createUser(userData);

      const savedUser = await transactionalEntityManager.getRepository(User).save(userEntity);
      const authEntity = await this.authRepository.createAuth(
        this.authUtils.buildAuthEntity(savedUser, hashedPassword, emailToken),
      );
      await transactionalEntityManager.getRepository(Auth).save(authEntity);

      return savedUser;
    });

    return instanceToPlain(newUser) as UserResponseDTO;
  }

  async login(credentials: UserSigninDTO): Promise<LoginResponseDTO> {
    const auth = await this.authRepository.getByEmail(credentials.email);

    if (!auth) {
      throw ErrorFactory.unauthenticated('Missing email or password');
    }

    const passwordMatch = await this.authUtils.verifyPassword(
      credentials.password,
      auth.hashedPassword,
    );

    if (!passwordMatch) {
      throw ErrorFactory.unauthenticated('Invalid email or password');
    }

    const user = auth.userByUserId;
    if (!user) {
      throw ErrorFactory.unauthenticated('User record missing');
    }

    if (!user.isEmailConfirmed) {
      throw ErrorFactory.unauthenticated('Please confirm your email before logging in');
    }

    const userPayload: JwtPayloadUnsigned = this.authUtils.createJwtUnsignedPayload(user);

    const token = this.authUtils.generateToken(userPayload);

    return { token, user: userPayload as UserSessionDTO } as LoginResponseDTO;
  }
  async confirmEmail(token: string) {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { email?: string };
    const storedConfirmationToken = await this.getStoredConfirmationToken(payload.email!);
    if (storedConfirmationToken !== token) {
      throw new Error('Token does not match stored token');
    }
    const email = payload.email!;

    await this.userService.confirmUserEmailByEmail(email);
  }
}
