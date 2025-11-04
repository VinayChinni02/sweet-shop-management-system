import { dbRun, dbAll, dbGet } from '../db/database';
import { Purchase } from '../models/User';

export class PurchaseService {
  async recordPurchase(
    userId: number,
    sweetId: number,
    quantity: number,
    pricePerKg: number,
    totalPrice: number
  ): Promise<Purchase> {
    const result = await dbRun(
      `INSERT INTO purchases (user_id, sweet_id, quantity, price_per_kg, total_price) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, sweetId, quantity, pricePerKg, totalPrice]
    ) as { lastID: number };

    const purchase = await dbGet(
      'SELECT * FROM purchases WHERE id = ?',
      [result.lastID]
    ) as Purchase | undefined;

    if (!purchase) {
      throw new Error('Failed to create purchase record');
    }

    return purchase;
  }

  async getUserPurchases(userId: number): Promise<any[]> {
    const purchases = await dbAll(
      `SELECT 
        p.id,
        p.user_id,
        p.sweet_id,
        p.quantity,
        p.price_per_kg,
        p.total_price,
        p.created_at,
        u.email as user_email,
        u.name as user_name,
        u.phone as user_phone,
        s.name as sweet_name,
        s.category as sweet_category
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      JOIN sweets s ON p.sweet_id = s.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC`,
      [userId]
    );
    return purchases;
  }

  async getAllPurchases(): Promise<any[]> {
    // Security: Only select non-sensitive user data (explicitly exclude password)
    const purchases = await dbAll(
      `SELECT 
        p.id,
        p.user_id,
        p.sweet_id,
        p.quantity,
        p.price_per_kg,
        p.total_price,
        p.created_at,
        u.email as user_email,
        u.name as user_name,
        u.phone as user_phone,
        s.name as sweet_name,
        s.category as sweet_category
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      JOIN sweets s ON p.sweet_id = s.id
      ORDER BY p.created_at DESC`
    );
    // Double-check: Remove password if it somehow exists
    return purchases.map((purchase: any) => {
      const { password, ...safePurchase } = purchase;
      return safePurchase;
    });
  }

  async getPurchasesBySweet(sweetId: number): Promise<any[]> {
    const purchases = await dbAll(
      `SELECT 
        p.id,
        p.user_id,
        p.sweet_id,
        p.quantity,
        p.price_per_kg,
        p.total_price,
        p.created_at,
        u.email as user_email,
        u.name as user_name,
        u.phone as user_phone,
        s.name as sweet_name,
        s.category as sweet_category
      FROM purchases p
      JOIN users u ON p.user_id = u.id
      JOIN sweets s ON p.sweet_id = s.id
      WHERE p.sweet_id = ?
      ORDER BY p.created_at DESC`,
      [sweetId]
    );
    return purchases;
  }
}

