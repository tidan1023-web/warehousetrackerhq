require('dotenv').config();
require('express-async-errors');

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const mongoSanitize  = require('express-mongo-sanitize');
const hpp            = require('hpp');
const connectDB      = require('./config/database');
const errorHandler   = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes               = require('./routes/auth');
const companyRoutes            = require('./routes/company');
const siteReportRoutes         = require('./routes/siteReports');
const historicalProjectRoutes  = require('./routes/historicalProjects');
const estimateRoutes           = require('./routes/estimates');
const invoiceRoutes            = require('./routes/invoices');

const app = express();
connectDB();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
    if (origin.endsWith('.onrender.com')) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Security headers (helmet) ─────────────────────────────────────────────────
// Sets X-Content-Type-Options, X-Frame-Options, HSTS, etc. automatically
app.use(helmet());

// ── Body parsing with size limit ──────────────────────────────────────────────
// 10kb limit prevents large-payload DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── NoSQL injection prevention ────────────────────────────────────────────────
// Strips $ and . from user-supplied keys so they can't manipulate MongoDB queries
app.use(mongoSanitize());

// ── HTTP Parameter Pollution prevention ──────────────────────────────────────
// Collapses duplicate query-string params so e.g. ?role=admin&role=client is safe
app.use(hpp());

// ── Global rate limiting (all /api/* routes) ──────────────────────────────────
// 120 requests per minute per IP; auth routes get a tighter limiter on top of this
app.use('/api/', apiLimiter);

// ── Health / root ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Pico Bello Estimator API', version: '2.0.0' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── API v1 routes ─────────────────────────────────────────────────────────────
// All routes are available at both /api/v1/* (new) and /api/* (backward-compatible)
// so the existing frontend continues to work without changes.
const V1 = '/api/v1';
const V0 = '/api';

[V1, V0].forEach((prefix) => {
  app.use(`${prefix}/auth`,                authRoutes);
  app.use(`${prefix}/company`,             companyRoutes);
  app.use(`${prefix}/site-reports`,        siteReportRoutes);
  app.use(`${prefix}/historical-projects`, historicalProjectRoutes);
  app.use(`${prefix}/estimates`,           estimateRoutes);
  app.use(`${prefix}/invoices`,            invoiceRoutes);
});

// ── 404 + error handler ───────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Pico Bello Estimator API running on port ${PORT}`));
