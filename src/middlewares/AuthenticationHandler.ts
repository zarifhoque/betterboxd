import { Response, NextFunction } from 'express';
import { createError, ErrorFactory } from '../errors/ErrorFactory';
import { AuthRequest, JwtPayload } from '../types/AuthTypes';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/Env';

export const authenticateJWTHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    // throw createError('Unauthorized', 'Missing or invalid Authorization header');
    ErrorFactory.unauthorized('Missing or invalid Authorization header');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (error: unknown) {
    next(ErrorFactory.unauthorized('Invalid or expired token'));
  }
};
