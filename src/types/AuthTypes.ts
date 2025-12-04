// src/middleware/types/AuthRequest.ts
import { Request } from 'express';
import { UserRole } from '../entities/User';

export interface JwtPayload {
  userId: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: Date;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
