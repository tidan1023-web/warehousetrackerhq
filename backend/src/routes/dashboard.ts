import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireStaff } from '../middleware/rbac';
import { getDashboardStats } from '../controllers/dashboardController';

const router = Router();
router.get('/stats', authenticate, requireStaff, getDashboardStats);
export default router;
