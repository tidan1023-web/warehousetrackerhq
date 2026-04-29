require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard');
const qsPricesRoutes = require('./routes/qsPrices');
const artisanPricesRoutes = require('./routes/artisanPrices');
const materialPricesRoutes = require('./routes/materialPrices');
const pricingRoutes = require('./routes/pricing');
const boqRoutes = require('./routes/boq');
const notificationRoutes = require('./routes/notifications');
const invoiceRoutes = require('./routes/invoices');
const approvalRoutes = require('./routes/approvals');
const commentRoutes = require('./routes/comments');
const progressRoutes = require('./routes/progress');
const changeOrderRoutes = require('./routes/changeOrders');
const analyticsRoutes = require('./routes/analytics');

// Configure web-push VAPID keys (only when real keys are provided)
const vapidPublic = (process.env.VAPID_PUBLIC_KEY || '').trim();
const vapidPrivate = (process.env.VAPID_PRIVATE_KEY || '').trim();
if (vapidPublic.length > 10 && vapidPrivate.length > 10) {
  try {
    webpush.setVapidDetails(
      `mailto:${(process.env.VAPID_EMAIL || 'admin@picobello.com').trim()}`,
      vapidPublic,
      vapidPrivate
    );
  } catch (e) {
    console.warn('VAPID configuration skipped:', e.message);
  }
}

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pico-bello-boq-api', timestamp: new Date().toISOString() });
});

// Expose VAPID public key for frontend subscription
app.get('/api/push/vapid-public-key', (_req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/qs-prices', qsPricesRoutes);
app.use('/api/artisan-prices', artisanPricesRoutes);
app.use('/api/material-prices', materialPricesRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/boq', boqRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/change-orders', changeOrderRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Pico Bello BOQ API running on port ${PORT}`));
