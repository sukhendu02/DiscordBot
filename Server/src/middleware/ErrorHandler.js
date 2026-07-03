// src/middleware/errorHandler.js

import { ValidationError, UniqueConstraintError, DatabaseError } from "sequelize";


// CUSTOM APP ERROR CLASS


export class AppError extends Error {
  constructor(message, statusCode = 400, code = "APP_ERROR", details = null) {
    super(message);
    this.statusCode  = statusCode;
    this.code        = code;
    this.details     = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}


// TYPED ERROR FACTORIES  


export const NotFoundError = (resource = "Resource") =>
  new AppError(`${resource} not found`, 404, "NOT_FOUND");

export const BadRequestError = (msg, details = null) =>
  new AppError(msg, 400, "BAD_REQUEST", details);

export const UnauthorizedError = (msg = "Unauthorized") =>
  new AppError(msg, 401, "UNAUTHORIZED");

export const ForbiddenError = (msg = "You don't have permission") =>
  new AppError(msg, 403, "FORBIDDEN");

export const ConflictError = (resource = "Resource") =>
  new AppError(`${resource} already exists`, 409, "CONFLICT");

export const DuplicateInteractionError = (msg = "Interaction already processed") =>
    new AppError(msg,409,"DUPLICATE_INTERACTION");

export const UnprocessableError = (msg, details = null) =>
  new AppError(msg, 422, "UNPROCESSABLE", details);



export const ServiceUnavailableError = () =>
  new AppError("Service temporarily unavailable", 503, "SERVICE_UNAVAILABLE");

export const InteractionTimeoutError = (msg="Interaction processing timed out") =>new AppError(msg,
        504,
        "INTERACTION_TIMEOUT"
    );

// RESPONSE BUILDER


function buildErrorResponse(statusCode, code, message, details = null, stack = null) {
  const response = {
    success:   false,
    error: {
      code,
      message,
      ...(details  && { details }),
      ...(stack    && { stack }),
    },
    timestamp: new Date().toISOString(),
  };
  return response;
}


// SEQUELIZE ERROR HANDLER


function handleSequelizeError(err) {
  // Validation errors (required fields, length, format, etc.)
  if (err instanceof ValidationError) {
    const details = err.errors.map((e) => ({
      field:   e.path,
      message: e.message,
      value:   e.value,
      type:    e.type,
    }));
    return {
      statusCode: 422,
      code:       "VALIDATION_ERROR",
      message:    "Validation failed",
      details,
    };
  }

  // Unique constraint (duplicate email, phone, etc.)
  if (err instanceof UniqueConstraintError) {
    const fields = err.errors.map((e) => e.path).join(", ");
    return {
      statusCode: 409,
      code:       "DUPLICATE_ENTRY",
      message:    `${fields} already exists`,
      details:    err.errors.map((e) => ({ field: e.path, value: e.value })),
    };
  }

  // Generic DB error (bad SQL, constraint violations, etc.)
  if (err instanceof DatabaseError) {
    return {
      statusCode: 400,
      code:       "DATABASE_ERROR",
      message:    "A database error occurred",
      details:    process.env.NODE_ENV !== "production" ? err.message : null,
    };
  }

  return null;
}

// GLOBAL ERROR HANDLER MIDDLEWARE
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const isDev  = process.env.NODE_ENV === "development";
  const isProd = process.env.NODE_ENV === "production";

  // Log every error in dev, only non-operational in prod
  if (isDev || !err.isOperational) {
    console.error(`\n🔴 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.error(err);
  }

  // ── 1. Operational / known app errors ──────────────────────────
  if (err.isOperational) {
    return res.status(err.statusCode).json(
      buildErrorResponse(
        err.statusCode,
        err.code,
        err.message,
        err.details,
        isDev ? err.stack : null
      )
    );
  }

  // ── 2. Sequelize errors ─────────────────────────────────────────
  const sequelizeError = handleSequelizeError(err);
  if (sequelizeError) {
    return res.status(sequelizeError.statusCode).json(
      buildErrorResponse(
        sequelizeError.statusCode,
        sequelizeError.code,
        sequelizeError.message,
        sequelizeError.details,
        isDev ? err.stack : null
      )
    );
  }



  // ── 5. Syntax errors (malformed JSON body) ──────────────────────
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json(
      buildErrorResponse(400, "INVALID_JSON", "Malformed JSON in request body")
    );
  }

  // ── 6. Unknown / programming errors ─────────────────────────────
  // Never leak internals in production
  return res.status(500).json(
    buildErrorResponse(
      500,
      "INTERNAL_SERVER_ERROR",
      isProd ? "Something went wrong" : err.message,
      null,
      isDev ? err.stack : null
    )
  );
}


// 404 HANDLER  — register BEFORE errorHandler in Server.js

export function notFoundHandler(req, res) {
  res.status(404).json(
    buildErrorResponse(
      404,
      "ROUTE_NOT_FOUND",
      `Route ${req.method} ${req.originalUrl} does not exist`
    )
  );
}