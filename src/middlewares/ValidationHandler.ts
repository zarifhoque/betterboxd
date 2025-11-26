import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodTypeAny } from 'zod';

interface ValidationOptions {
  source?: 'body' | 'query' | 'params';
}

export function validationHandler<T extends ZodTypeAny>(
  schema: ZodObject<T>,
  options: ValidationOptions = { source: 'body' },
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const source = options.source || 'body';
    const data = req[source];
    const result: ReturnType<typeof schema.safeParse> = schema.safeParse(data);
    if (!result.success) {
      return next(result.error);
    }
    req[source] = result.data;
    next();
  };
}
