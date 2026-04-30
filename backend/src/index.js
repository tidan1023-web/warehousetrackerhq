require('dotenv').config();
require('express-async-errors');

const express     = require('express');
const cors        = require('cors');
const connectDB   = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes               = require('./routes/auth');
const companyRoutes            = require('./routes/company');
const siteReportRoutes         = require('./routes/siteReports');
const historicalProjectRoutes  = require('./routes/historicalProjects');
const estimateRoutes           = require('./routes/estimates');

const app = express();
connectDB();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'Pico Bello Estimator API', version: '2.0.0' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth',                authRoutes);
app.use('/api/company',             companyRoutes);
app.use('/api/site-reports',        siteReportRoutes);
app.use('/api/historical-projects', historicalProjectRoutes);
app.use('/api/estimates',           estimateRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Pico Bello Estimator API running on port ${PORT}`));
