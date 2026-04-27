'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  login,
  refreshToken,
  getMe,
  createUser,
  listUsers,
  deactivateUser,
} = require('../controllers/authController');

const router = Router();

router.post(
  '/login',
  authLimiter,
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 1 }).withMessage('Password required'),
  ]),
  login
);

router.post(
  '/refresh',
  validate([body('refreshToken').notEmpty().withMessage('Refresh token required')]),
  refreshToken
);

router.get('/me', authenticate, getMe);

router.post(
  '/users',
  authenticate,
  requireAdmin,
  validate([
    body('employeeId')
      .matches(/^[A-Z0-9-]{3,20}$/i)
      .withMessage('Employee ID must be 3-20 alphanumeric characters'),
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
    body('role').isIn(['admin', 'staff']).withMessage('Role must be admin or staff'),
  ]),
  createUser
);

router.get('/users', authenticate, requireAdmin, listUsers);
router.patch('/users/:id/deactivate', authenticate, requireAdmin, deactivateUser);

module.exports = router;
