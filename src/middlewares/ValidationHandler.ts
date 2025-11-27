import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import { logger } from '../config/Logger';

interface ValidationOptions {
  source?: 'body' | 'query' | 'params';
}

export function validationHandler<T extends ZodRawShape>(
  schema: ZodObject<T>,
  options: ValidationOptions = { source: 'body' },
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const source = options.source || 'body';
    const data = req[source];
    const result: ReturnType<typeof schema.safeParse> = schema.safeParse(data);
    logger.debug(result);
    if (!result.success) {
      return next(result.error);
    }
    next();
  };
}
