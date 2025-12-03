// src/middleware/types/AuthRequest.ts
import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  username: string;
  name: string;
  email: string;
  role: string;
  joinDate: Date;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
