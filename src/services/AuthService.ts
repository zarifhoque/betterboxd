import { AuthRepository } from '../repositories/AuthRepository';
import { Auth } from '../entities/Auth';
import { instanceToPlain } from 'class-transformer';
import { createError } from '../errors/ErrorFactory';
import { UserResponseDTO, UserSigninDTO } from '../dtos/UserDTOs';
import { ENV } from '../config/Env';
import bcrypt from 'bcrypt';
import { LoginResponseDTO } from '../dtos/AuthDTOs';
import jwt from 'jsonwebtoken';
import { logger } from '../config/Logger';
import { JwtPayload } from '../types/AuthTypes';

export class AuthService {
  private authRepository = new AuthRepository();

  // Get auth record by username
  async getByUsername(username: string): Promise<Auth> {
    const auth = await this.authRepository.getByUsername(username);
    if (!auth) {
      throw createError('NotFound', `Auth record for username "${username}" not found`);
    }
    return auth;
  }

  // Get auth record by email
  async getByEmail(email: string): Promise<Auth> {
    const auth = await this.authRepository.getByEmail(email);
    if (!auth) {
      throw createError('NotFound', `Auth record for email "${email}" not found`);
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

  async login(credentials: UserSigninDTO): Promise<LoginResponseDTO> {
    const auth = await this.authRepository.getByEmail(credentials.email);
    logger.debug(JSON.stringify(credentials));

    if (!auth) {
      throw createError('Unauthorized', 'Missing email or password');
    }

    const passwordMatch = await bcrypt.compare(credentials.password, auth.hashedPassword);
    logger.debug(await bcrypt.hash(credentials.password, 10));
    logger.debug(auth.hashedPassword);

    if (!passwordMatch) {
      throw createError('Unauthorized', 'Invalid email or password');
    }

    const user = auth.userByUsername;
    logger.debug(JSON.stringify(auth));

    if (!user) {
      throw createError('Unauthorized', 'User record missing');
    }

    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.userId,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: user.joinDate,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '30d',
    });

    return { token, user: payload as UserResponseDTO };
  }
}
