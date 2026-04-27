'use strict';
const Sentry = require('@sentry/node');
const logger = require('../utils/logger');

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error('Request error', {
    message: err.message,
    statusCode,
    method: req.method,
    path: req.path,
    stack: err.stack,
  });

  if (!err.isOperational && isProduction) {
    Sentry.captureException(err);
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation failed', details: err.message });
    return;
  }

  if (err.code === '11000') {
    res.status(409).json({ error: 'A record with that value already exists' });
    return;
  }

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(!isProduction && err.stack ? { stack: err.stack } : {}),
  });
}

function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}

module.exports = { createError, errorHandler, notFound };
