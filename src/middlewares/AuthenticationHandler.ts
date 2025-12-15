import { Response, NextFunction } from 'express';
import { ErrorFactory } from '../errors/ErrorFactory';
import { AuthRequest, JwtPayload } from '../types/AuthTypes';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/Env';
import { UserService } from '../services/UserService';
import { injectable } from 'tsyringe';
import { AuthService } from '../services/AuthService';

@injectable()
export class AuthenticationMiddleWare {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  authenticateJWTHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ErrorFactory.unauthorized('Missing or invalid Authorization header');
      }

      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

      const auth = await this.authService.getAuthByUserId(payload.userId);
      if (!auth) {
        throw ErrorFactory.unauthorized('User is deactivated or auth record missing');
      }

      const tokenPwdLastMod = payload.pwdlmod;
      const currentPwdLastMod = auth.passwordLastModificationTime
        ? auth.passwordLastModificationTime.getTime()
        : 0;

      if (tokenPwdLastMod < currentPwdLastMod) {
        throw ErrorFactory.unauthorized('Token invalid: password changed after token issuance');
      }

      req.user = payload;
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}
