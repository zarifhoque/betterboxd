import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, BadRequestError } from '../errors/AppErrors';

interface ErrorResponse {
  message: string;
  status: number;
  details?: unknown;
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let error: AppError;
  let errorDetails: unknown = null;
  console.error('Error occurred:', err);

  if (err instanceof ZodError) {
    const formattedMessage = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');

    error = new BadRequestError(formattedMessage);
    errorDetails = err.issues;
  } else if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new AppError(err.message, 500);
    errorDetails = {
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
  } else {
    error = new AppError('An unknown error occurred', 500);
    errorDetails = process.env.NODE_ENV === 'development' ? err : undefined;
  }

  const response: ErrorResponse = {
    message: error.message,
    status: error.statusCode,
  };

  if (process.env.NODE_ENV === 'development' && errorDetails) {
    response.details = errorDetails;
  }

  if (error.statusCode === 500 && process.env.NODE_ENV === 'production') {
    response.message = 'Internal Server Error';
  }

  res.locals = { ...res.locals, errorMessage: error.message };

  res.status(error.statusCode).json(response);
}
