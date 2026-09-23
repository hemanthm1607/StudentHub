/**
 * Standardized application error hierarchy.
 * Ensures consistent API error responses without exposing raw stack traces.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ValidationError extends AppError {
  public readonly errors?: unknown;

  constructor(message = "Validation failed", errors?: unknown) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}
