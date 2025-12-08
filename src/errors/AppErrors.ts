import { ERROR_DEFINITIONS } from '../constants/HTTPConstants';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends AppError {
  details?: string[];
  constructor(message: string, details?: string[]) {
    super(message, ERROR_DEFINITIONS.BAD_REQUEST.status);
    this.name = ERROR_DEFINITIONS.BAD_REQUEST.name;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.NOT_FOUND.status);
    this.name = ERROR_DEFINITIONS.NOT_FOUND.name;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.CONFLICT.status);
    this.name = ERROR_DEFINITIONS.CONFLICT.name;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.UNAUTHORIZED.status);
    this.name = ERROR_DEFINITIONS.UNAUTHORIZED.name;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.UNAUTHENTICATED.status);
    this.name = ERROR_DEFINITIONS.UNAUTHENTICATED.name;
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.FORBIDDEN.status);
    this.name = ERROR_DEFINITIONS.FORBIDDEN.name;
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.status);
    this.name = ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.name;
  }
}
