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
  updateProfile,
  changePassword,
  createUser,
  listUsers,
  getUserById,
  getUserStats,
  updatePerformanceRating,
  addComment,
  getComments,
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

router.patch(
  '/profile',
  authenticate,
  validate([
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('department').optional().trim().isLength({ max: 100 }),
    body('about').optional().trim().isLength({ max: 500 }),
  ]),
  updateProfile
);

router.patch(
  '/profile/password',
  authenticate,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
  ]),
  changePassword
);

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
router.get('/users/:id', authenticate, requireAdmin, getUserById);
router.patch('/users/:id/deactivate', authenticate, requireAdmin, deactivateUser);
router.get('/users/:id/stats', authenticate, getUserStats);
router.patch('/users/:id/rating', authenticate, requireAdmin, updatePerformanceRating);
router.post('/users/:id/comments', authenticate, requireAdmin, addComment);
router.get('/users/:id/comments', authenticate, requireAdmin, getComments);

module.exports = router;
