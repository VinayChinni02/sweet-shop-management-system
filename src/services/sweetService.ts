import { dbGet, dbAll, dbRun } from '../db/database';
import { Sweet, SweetCreate, SweetUpdate, SearchFilters } from '../models/Sweet';

export class SweetService {
  async createSweet(sweetData: SweetCreate): Promise<Sweet> {
    const { name, category, pricePerKilo, price, quantity = 0 } = sweetData;

    if (!name || !category || (!pricePerKilo && price === undefined) || (pricePerKilo !== undefined && pricePerKilo < 0)) {
      throw new Error('Invalid sweet data');
    }

    // Check if sweet with same name already exists (enforce uniqueness)
    const existingSweet = await dbGet('SELECT id FROM sweets WHERE name = ?', [name]) as Sweet | undefined;
    if (existingSweet) {
      throw new Error(`A sweet with the name "${name}" already exists. Each sweet must have a unique name.`);
    }

    // Use pricePerKilo if provided, otherwise use price (backward compatibility)
    const finalPricePerKilo = pricePerKilo || price || 0;
    const finalPrice = price || finalPricePerKilo; // Keep price for backward compatibility

    try {
      const result = await dbRun(
        'INSERT INTO sweets (name, category, price, price_per_kilo, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, category, finalPrice, finalPricePerKilo, quantity]
      ) as { lastID: number };

      const sweet = await dbGet('SELECT *, price_per_kilo as pricePerKilo FROM sweets WHERE id = ?', [result.lastID]) as Sweet;
      return sweet;
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error(`A sweet with the name "${name}" already exists. Each sweet must have a unique name.`);
      }
      throw error;
    }
  }

  async getAllSweets(): Promise<Sweet[]> {
    const sweets = await dbAll('SELECT *, price_per_kilo as pricePerKilo FROM sweets ORDER BY created_at DESC') as Sweet[];
    return sweets;
  }

  async getSweetById(id: number): Promise<Sweet | null> {
    const sweet = await dbGet('SELECT *, price_per_kilo as pricePerKilo FROM sweets WHERE id = ?', [id]) as Sweet | undefined;
    return sweet || null;
  }

  async updateSweet(id: number, updates: SweetUpdate): Promise<Sweet | null> {
    const existingSweet = await this.getSweetById(id);
    if (!existingSweet) {
      return null;
    }

    // If updating name, check for uniqueness (excluding current sweet)
    if (updates.name !== undefined && updates.name !== existingSweet.name) {
      const duplicateSweet = await dbGet('SELECT id FROM sweets WHERE name = ? AND id != ?', [updates.name, id]) as Sweet | undefined;
      if (duplicateSweet) {
        throw new Error(`A sweet with the name "${updates.name}" already exists. Each sweet must have a unique name.`);
      }
    }

    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.category !== undefined) {
      updateFields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.price !== undefined) {
      updateFields.push('price = ?');
      values.push(updates.price);
    }
    if (updates.pricePerKilo !== undefined) {
      updateFields.push('price_per_kilo = ?');
      values.push(updates.pricePerKilo);
    }
    if (updates.quantity !== undefined) {
      updateFields.push('quantity = ?');
      values.push(updates.quantity);
    }

    if (updateFields.length === 0) {
      return existingSweet;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    try {
      await dbRun(
        `UPDATE sweets SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      return await this.getSweetById(id);
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error(`A sweet with the name "${updates.name}" already exists. Each sweet must have a unique name.`);
      }
      throw error;
    }
  }

  async deleteSweet(id: number): Promise<boolean> {
    const result = await dbRun('DELETE FROM sweets WHERE id = ?', [id]) as { changes: number };
    return result.changes > 0;
  }

  async searchSweets(filters: SearchFilters): Promise<Sweet[]> {
    let query = 'SELECT * FROM sweets WHERE 1=1';
    const params: any[] = [];

    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.minPrice !== undefined) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    query += ' ORDER BY created_at DESC';

    const sweets = await dbAll(query.replace('SELECT *', 'SELECT *, price_per_kilo as pricePerKilo'), params) as Sweet[];
    return sweets;
  }

  async purchaseSweet(id: number, quantity: number): Promise<Sweet | null> {
    const sweet = await this.getSweetById(id);
    if (!sweet) {
      return null;
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient quantity in stock');
    }

    const newQuantity = sweet.quantity - quantity;
    return await this.updateSweet(id, { quantity: newQuantity });
  }

  async restockSweet(id: number, quantity: number): Promise<Sweet | null> {
    const sweet = await this.getSweetById(id);
    if (!sweet) {
      return null;
    }

    const newQuantity = sweet.quantity + quantity;
    return await this.updateSweet(id, { quantity: newQuantity });
  }
}

