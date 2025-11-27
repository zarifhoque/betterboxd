import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppErrors';
import { isDev, isProd } from '../config/Env';
import { createError } from '../errors/ErrorFactory';
import { logger } from '../config/Logger';

interface ErrorResponse {
  message: string;
  status: number;
  details?: string[] | unknown;
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  let error: AppError;
  let errorDetails: unknown = null;
  logger.error('Error occurred:', err);

  if (err instanceof ZodError) {
    const formattedMessage = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = createError('BadRequest', formattedMessage);
    errorDetails = err.issues;
  } else if (err instanceof AppError) {
    error = err;
  } else if (err instanceof SyntaxError && 'body' in err) {
    error = createError('BadRequest', 'Invalid JSON syntax in request body');
    errorDetails = {
      message: err.message,
      stack: isDev ? err.stack : undefined,
    };
  } else if (err instanceof Error) {
    error = createError('InternalServerError', err.message);
    errorDetails = {
      name: err.name,
      stack: isDev ? err.stack : undefined,
    };
  } else if (typeof err === 'string') {
    error = createError('InternalServerError', err);
  } else {
    error = createError('InternalServerError', 'An unknown error occurred');
    errorDetails = isDev ? err : undefined;
  }

  const response: ErrorResponse = {
    message: error.message,
    status: error.statusCode,
  };

  if (isDev && errorDetails) {
    response.details = errorDetails;
  }

  if (error.statusCode === 500 && isProd) {
    response.message = 'Internal Server Error';
  }

  res.locals = { ...res.locals, errorMessage: error.message };

  res.status(error.statusCode).json(response);
}
