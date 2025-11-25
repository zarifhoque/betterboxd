import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export function validateRequest(schema: ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result: ReturnType<typeof schema.safeParse> = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    next();
  };
}
