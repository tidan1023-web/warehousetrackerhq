import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';
import {
  getEbayAuthUrl,
  handleEbayCallback,
  syncProductToEbay,
  getEbayStatus,
} from '../controllers/ebayController';

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

export default router;
