'use strict';
const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');
const {
  getEbayAuthUrl,
  handleEbayCallback,
  syncProductToEbay,
  getEbayStatus,
} = require('../controllers/ebayController');

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/auth-url', getEbayAuthUrl);
router.get('/callback', handleEbayCallback);
router.get('/status', getEbayStatus);

router.post(
  '/products/:id/sync',
  validate([
    param('id').isMongoId(),
    body('price').isFloat({ min: 0.01 }).withMessage('Valid price required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('condition')
      .optional()
      .isIn(['NEW', 'LIKE_NEW', 'USED_EXCELLENT', 'USED_GOOD', 'USED_ACCEPTABLE', 'FOR_PARTS'])
      .withMessage('Invalid condition'),
  ]),
  syncProductToEbay
);

module.exports = router;
