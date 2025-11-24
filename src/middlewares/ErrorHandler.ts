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

  if (err instanceof ZodError) {
    // Handle Zod validation errors
    const formattedMessage = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');

    error = new BadRequestError(formattedMessage);
    errorDetails = err.errors;
  } else if (err instanceof AppError) {
    // Custom errors thrown from services/repositories
    error = err;
  } else if (err instanceof Error) {
    // Unknown errors
    error = new AppError(err.message, 500);
    errorDetails = {
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
  } else {
    // Anything else thrown (not Error)
    error = new AppError('An unknown error occurred', 500);
    errorDetails = process.env.NODE_ENV === 'development' ? err : undefined;
  }

  const response: ErrorResponse = {
    message: error.message,
    status: error.statusCode,
  };

  // Include details only in development mode
  if (process.env.NODE_ENV === 'development' && errorDetails) {
    response.details = errorDetails;
  }

  // Mask internal errors in production
  if (error.statusCode === 500 && process.env.NODE_ENV === 'production') {
    response.message = 'Internal Server Error';
  }

  // Optional: store the error message for logging middleware
  res.locals = { ...res.locals, errorMessage: error.message };

  res.status(error.statusCode).json(response);
}
