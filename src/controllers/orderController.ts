import { Response } from 'express';
import { PurchaseService } from '../services/purchaseService';
import { AuthRequest } from '../middleware/auth';

const purchaseService = new PurchaseService();

// Get all orders - Admin only (protected by requireAdmin middleware in routes)
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only admins can access this (middleware ensures this)
    const orders = await purchaseService.getAllPurchases();
    
    // Security: Ensure no password data is included
    // The purchaseService already excludes passwords, but we double-check
    const safeOrders = orders.map((order: any) => {
      const { password, ...safeOrder } = order;
      return safeOrder;
    });
    
    res.json(safeOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
};
