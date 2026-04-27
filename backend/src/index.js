'use strict';
require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const { connectDatabase } = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { User } = require('./models/User');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const defectRoutes = require('./routes/defects');
const auditRoutes = require('./routes/audit');
const dashboardRoutes = require('./routes/dashboard');
const ebayRoutes = require('./routes/ebay');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2,
  });
}

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', '*.amazonaws.com'],
        connectSrc: ["'self'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('CORS: origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (_req, res) => res.statusCode < 400 && process.env.NODE_ENV === 'production',
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'warehouse-inventory-hq-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ebay', ebayRoutes);

app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await seedAdminIfNeeded();

  const PORT = parseInt(process.env.PORT || '5000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Warehouse Inventory HQ API running on port ${PORT}`, {
      env: process.env.NODE_ENV,
      port: PORT,
    });
  });
}

async function seedAdminIfNeeded() {
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const adminEmpId = process.env.BOOTSTRAP_ADMIN_EMPLOYEE_ID;

  if (!adminEmail || !adminPassword || !adminEmpId) return;

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) return;

  await User.create({
    employeeId: adminEmpId,
    name: 'System Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  logger.info('Bootstrap admin account created', { email: adminEmail });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});

module.exports = app;
