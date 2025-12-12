// src/middleware/types/AuthRequest.ts
import { Request } from 'express';
import { UserRole } from '../entities/User';

export type JwtPayload = {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type JwtPayloadUnsigned = Omit<JwtPayload, 'iat' | 'exp'>;

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
