import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadGatewayError,
} from './AppErrors';

export class ErrorFactory {
  static badRequest(message: string, details?: string[]) {
    return new BadRequestError(message, details);
  }

  static unauthorized(message: string) {
    return new UnauthorizedError(message);
  }

  static forbidden(message: string) {
    return new ForbiddenError(message);
  }

  static notFound(message: string) {
    return new NotFoundError(message);
  }

  static conflict(message: string) {
    return new ConflictError(message);
  }

  static internal(message: string) {
    return new InternalServerError(message);
  }

  static badGateway(message: string) {
    return new BadGatewayError(message);
  }
}
