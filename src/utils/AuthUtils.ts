import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload, JwtPayloadUnsigned } from '../types/AuthTypes';
import { ENV } from '../config/Env';
import { User } from '../entities/User';
import { Auth } from '../entities/Auth';
import { logger } from '../config/Logger';
import { injectable } from 'tsyringe';
import { UserService } from '../services/UserService';

@injectable()
export class AuthUtils {
  constructor(private userService: UserService) {}
  verifyPassword = async (plain: string, hashed: string): Promise<boolean> => {
    return bcrypt.compare(plain, hashed);
  };

  generateToken = (userPayload: JwtPayloadUnsigned): string => {
    return jwt.sign(userPayload as JwtPayload, ENV.JWT_SECRET, { expiresIn: '30d' });
  };

  createJwtUnsignedPayload = (user: User): JwtPayloadUnsigned => {
    return {
      userId: user.userId,
      role: user.role,
    };
  };

  buildAuthEntity = (user: User, hashedPassword: string, emailToken: string): Auth => {
    const auth = new Auth();
    auth.username = user.username;
    auth.email = user.email;
    auth.hashedPassword = hashedPassword;
    auth.userByUserId = user;
    auth.passwordLastModificationTime = new Date();
    auth.emailConfirmationToken = emailToken;
    return auth;
  };

  generateEmailConfirmationToken = (userEmail: string): string => {
    return jwt.sign({ userEmail }, ENV.JWT_SECRET, { expiresIn: '1h' });
  };
}
