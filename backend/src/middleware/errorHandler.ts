import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log all errors
  logger.error('Request error', {
    message: err.message,
    statusCode,
    method: req.method,
    path: req.path,
    stack: err.stack,
  });

  // Send non-operational (unexpected) errors to Sentry
  if (!err.isOperational && isProduction) {
    Sentry.captureException(err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation failed',
      details: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json({ error: 'A record with that value already exists' });
    return;
  }

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...((!isProduction && err.stack) ? { stack: err.stack } : {}),
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}
