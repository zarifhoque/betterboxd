import {
  AppError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  UnauthenticatedError,
  InternalServerError,
  ForbiddenError,
} from './AppErrors';

type ErrorType =
  | 'BadRequest'
  | 'NotFound'
  | 'Conflict'
  | 'Unauthorized'
  | 'Unauthenticated'
  | 'InternalServerError'
  | 'Forbidden';

export const createError = (type: ErrorType, message: string, details?: string[]): AppError => {
  switch (type) {
    case 'BadRequest':
      return new BadRequestError(message, details);
    case 'NotFound':
      return new NotFoundError(message);
    case 'Conflict':
      return new ConflictError(message);
    case 'Unauthorized':
      return new UnauthorizedError(message);
    case 'Unauthenticated':
      return new UnauthenticatedError(message);
    case 'InternalServerError':
      return new InternalServerError(message);
    case 'Forbidden':
      return new ForbiddenError(message);
    default:
      return new AppError(message, 500);
  }
};
