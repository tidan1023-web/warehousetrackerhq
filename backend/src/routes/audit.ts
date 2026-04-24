import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';
import { listAuditLogs, getEntityAuditTrail } from '../controllers/auditController';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', listAuditLogs);
router.get('/:entityType/:entityId', getEntityAuditTrail);

export default router;
