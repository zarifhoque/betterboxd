import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppErrors';
import { isDev, isProd } from '../config/Env';
import { ErrorFactory } from '../errors/ErrorFactory';
import { logger } from '../config/Logger';

interface ErrorResponse {
  message: string;
  status: number;
  details?: string[] | unknown;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error: AppError;
  let errorDetails: unknown = null;
  logger.error('Error occurred:', err);

  if (err instanceof ZodError) {
    const formattedMessage = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = ErrorFactory.badRequest(
      formattedMessage,
      err.issues.map((i) => i.message),
    );
    errorDetails = err.issues;
  } else if (err instanceof AppError) {
    error = err;
  } else if (err instanceof SyntaxError && 'body' in err) {
    error = ErrorFactory.badRequest('Invalid JSON syntax in request body');
    errorDetails = {
      message: err.message,
      stack: isDev ? err.stack : undefined,
    };
  } else if (err instanceof Error) {
    error = ErrorFactory.internal(err.message);
    errorDetails = {
      name: err.name,
      stack: isDev ? err.stack : undefined,
    };
  } else if (typeof err === 'string') {
    error = ErrorFactory.internal(err);
  } else {
    error = ErrorFactory.internal('An unknown error occurred');
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
};
