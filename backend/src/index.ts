import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { connectDatabase } from './config/database';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';
import { User } from './models/User';
import logger from './utils/logger';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import defectRoutes from './routes/defects';
import auditRoutes from './routes/audit';
import dashboardRoutes from './routes/dashboard';
import ebayRoutes from './routes/ebay';

// Initialize Sentry before everything else
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2,
  });
}

const app = express();

// Trust reverse proxy (Render, nginx)
app.set('trust proxy', 1);

// Security headers
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

// CORS — allow configured frontend origin only
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

// Request logging
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (_req, res) => res.statusCode < 400 && process.env.NODE_ENV === 'production',
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiter
app.use('/api/', apiLimiter);

// Health check — no auth, no rate limit, for Render
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'warehouse-inventory-hq-api',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/defects', defectRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ebay', ebayRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

async function bootstrap(): Promise<void> {
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

async function seedAdminIfNeeded(): Promise<void> {
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
  logger.error('Failed to start server', { error: (err as Error).message });
  process.exit(1);
});

export default app;
