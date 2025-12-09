import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload, JwtPayloadUnsigned } from '../types/AuthTypes';
import { ENV } from '../config/Env';
import { User } from '../entities/User';
import { Auth } from '../entities/Auth';

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

export const generateEmailConfirmationToken = (userId: string): string => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyEmailConfirmationToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as { userId: string };
  } catch (err: unknown) {
    throw new Error('Invalid or expired token');
  }
};
