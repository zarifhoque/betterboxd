import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/Logger';

export const loggerHandler = (req: Request, _res: Response, next: NextFunction) => {
  logger.info(`[Request] ${req.method} ${req.originalUrl}`);
  next();
};
