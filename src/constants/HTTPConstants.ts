export const ERROR_DEFINITIONS = {
  BAD_REQUEST: {
    status: 400,
    name: 'BadRequest',
  },
  UNAUTHORIZED: {
    status: 401,
    name: 'UnauthorizedError',
  },
  UNAUTHENTICATED: {
    status: 401,
    name: 'UnauthenticatedError',
  },
  FORBIDDEN: {
    status: 403,
    name: 'ForbiddenError',
  },
  NOT_FOUND: {
    status: 404,
    name: 'NotFoundError',
  },
  CONFLICT: {
    status: 409,
    name: 'ConflictError',
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    name: 'InternalServerError',
  },
  OK: {
    status: 200,
    name: 'OK',
  },
  CREATED: {
    status: 201,
    name: 'Created',
  },
  ACCEPTED: {
    status: 202,
    name: 'Accepted',
  },
  NO_CONTENT: {
    status: 204,
    name: 'NoContent',
  },
  BAD_GATEWAY: {
    status: 502,
    name: 'BadGateway',
  },
} as const;
