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
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'UnauthenticatedError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}
