import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload, JwtPayloadUnsigned } from '../types/AuthTypes';
import { ENV } from '../config/Env';
import { User } from '../entities/User';
import { Auth } from '../entities/Auth';
import { logger } from '../config/Logger';

export const verifyPassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const generateToken = (userPayload: JwtPayloadUnsigned): string => {
  return jwt.sign(userPayload as JwtPayload, ENV.JWT_SECRET, { expiresIn: '30d' });
};

export const createJwtUnsignedPayload = (user: User): JwtPayloadUnsigned => {
  return {
    userId: user.userId,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    joinDate: user.joinDate,
  };
};

export const buildAuthEntity = (user: User, hashedPassword: string): Auth => {
  const auth = new Auth();
  auth.username = user.username;
  auth.email = user.email;
  auth.hashedPassword = hashedPassword;
  auth.userByUserId = user;
  auth.passwordLastModificationTime = new Date();
  return auth;
};

export const generateEmailConfirmationToken = (userEmail: string): string => {
  return jwt.sign({ userEmail }, ENV.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyEmailConfirmationToken = (token: string): { email: string } => {
  try {
    logger.debug('Trying to verify with jwt token');
    logger.debug('Token to verify: ' + token);
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { userEmail?: string };
    logger.debug(`The payload is ${JSON.stringify(payload)}`);
    if (!payload.userEmail) {
      throw new Error('Token payload missing email');
    }
    return { email: payload.userEmail };
  } catch (err: unknown) {
    throw new Error('Invalid or expired token');
  }
};
