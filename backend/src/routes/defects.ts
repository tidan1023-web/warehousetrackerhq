import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireStaff } from '../middleware/rbac';
import { uploadLimiter } from '../middleware/rateLimiter';
import { multerMemoryConfig } from '../utils/s3Upload';
import {
  listDefects,
  createDefect,
  uploadDefectImage,
  acknowledgeDefect,
  resolveDefect,
} from '../controllers/defectController';

const router = Router();
const upload = multerMemoryConfig();

router.use(authenticate);

router.get('/', requireStaff, listDefects);

router.post(
  '/',
  requireStaff,
  validate([
    body('productId').isMongoId().withMessage('Valid product ID required'),
    body('severity')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be low, medium, high, or critical'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
  ]),
  createDefect
);

router.post(
  '/:id/images',
  requireStaff,
  uploadLimiter,
  validate([param('id').isMongoId()]),
  upload.single('image'),
  uploadDefectImage
);

router.patch(
  '/:id/acknowledge',
  requireAdmin,
  validate([param('id').isMongoId()]),
  acknowledgeDefect
);

router.patch(
  '/:id/resolve',
  requireAdmin,
  validate([
    param('id').isMongoId(),
    body('resolution').trim().isLength({ min: 5, max: 2000 }).withMessage('Resolution required (5-2000 chars)'),
  ]),
  resolveDefect
);

export default router;
