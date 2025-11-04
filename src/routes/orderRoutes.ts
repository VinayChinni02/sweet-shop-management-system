import { Router } from 'express';
import { getAllOrders } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All order routes require authentication and admin access
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAllOrders);

export default router;

