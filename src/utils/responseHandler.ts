// utils/responseHandler.ts
import { Request, Response, NextFunction } from 'express';

type ServiceFunction<T> = (req: Request) => Promise<T>;

export function handleRequest<T>(serviceFn: ServiceFunction<T>, statusCode = 200) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await serviceFn(req);
      res.status(statusCode).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
