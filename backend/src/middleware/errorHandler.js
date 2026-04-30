'use strict';

function errorHandler(err, req, res, _next) {
  const statusCode  = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[${req.method}] ${req.path} → ${statusCode}: ${err.message}`);
  if (!isProduction) console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', details: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(!isProduction && err.stack ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
