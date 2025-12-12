import { Response, NextFunction } from 'express';
import { ErrorFactory } from '../errors/ErrorFactory';
import { AuthRequest, JwtPayload } from '../types/AuthTypes';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/Env';
import { UserService } from '../services/UserService';
import { injectable } from 'tsyringe';

@injectable()
export class AuthenticationMiddleWare {
  constructor(private userService: UserService) {}
  authenticateJWTHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    try {
      if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        throw ErrorFactory.unauthorized('Missing or invalid Authorization header');
      }
      const token = authHeader.split(' ')[1];

      const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      const user = await this.userService.getUserById(payload.userId);
      if (!user) {
        throw ErrorFactory.unauthorized('User is deactivated and your token is invalid');
      }
      req.user = payload;
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}
