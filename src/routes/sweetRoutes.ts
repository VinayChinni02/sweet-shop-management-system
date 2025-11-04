import { Router } from 'express';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  createSweetValidators,
  updateSweetValidators,
} from '../controllers/sweetController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All sweet routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', createSweetValidators, createSweet);
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.put('/:id', updateSweetValidators, updateSweet);
router.delete('/:id', requireAdmin, deleteSweet);

// Inventory operations
router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', requireAdmin, restockSweet);

export default router;

