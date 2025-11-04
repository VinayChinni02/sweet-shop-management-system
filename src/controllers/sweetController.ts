import { Request, Response } from 'express';
import { SweetService } from '../services/sweetService';
import { PurchaseService } from '../services/purchaseService';
import { body, query, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

const sweetService = new SweetService();
const purchaseService = new PurchaseService();

export const createSweetValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('pricePerKilo').isFloat({ min: 0 }).withMessage('Price per kilo must be a non-negative number'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
];

export const updateSweetValidators = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('pricePerKilo').optional().isFloat({ min: 0 }).withMessage('Price per kilo must be a non-negative number'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
];

export const createSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const sweet = await sweetService.createSweet(req.body);
    res.status(201).json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create sweet' });
  }
};

export const getAllSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch sweets' });
  }
};

export const searchSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      name: req.query.name as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const sweets = await sweetService.searchSweets(filters);
    res.json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Search failed' });
  }
};

export const updateSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const id = parseInt(req.params.id);
    const sweet = await sweetService.updateSweet(id, req.body);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update sweet' });
  }
};

export const deleteSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await sweetService.deleteSweet(id);

    if (!deleted) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete sweet' });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    // Quantity in kg (0.25, 0.5, or 1.0)
    const quantity = parseFloat(req.body.quantity) || 0.25;

    if (quantity <= 0 || ![0.25, 0.5, 1.0].includes(quantity)) {
      res.status(400).json({ error: 'Quantity must be 0.25kg (250g), 0.5kg (500g), or 1kg' });
      return;
    }

    const sweet = await sweetService.purchaseSweet(id, quantity);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Calculate price based on quantity
    const pricePerKilo = sweet.pricePerKilo || sweet.price;
    const totalPrice = pricePerKilo * quantity;

    // Record the purchase
    try {
      await purchaseService.recordPurchase(
        req.user!.id,
        id,
        quantity,
        pricePerKilo,
        totalPrice
      );
    } catch (err) {
      console.error('Error recording purchase:', err);
      // Continue even if purchase recording fails
    }

    res.json({
      ...sweet,
      purchaseQuantity: quantity,
      purchasePrice: totalPrice,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Purchase failed' });
  }
};

export const restockSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const quantity = parseFloat(req.body.quantity);

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Valid quantity (in kg) is required' });
      return;
    }

    const sweet = await sweetService.restockSweet(id, quantity);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Restock failed' });
  }
};

