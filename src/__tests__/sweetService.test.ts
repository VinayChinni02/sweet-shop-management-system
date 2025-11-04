import { SweetService } from '../services/sweetService';
import { dbGet, dbAll, dbRun } from '../db/database';

jest.mock('../db/database');

describe('SweetService', () => {
  let sweetService: SweetService;

  beforeEach(() => {
    sweetService = new SweetService();
    jest.clearAllMocks();
  });

  describe('createSweet', () => {
    it('should create a new sweet successfully', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 10,
      };

      // Mock: First call checks if sweet exists (should return undefined), then returns created sweet
      (dbGet as jest.Mock)
        .mockResolvedValueOnce(undefined) // No existing sweet found
        .mockResolvedValueOnce(mockSweet); // Return created sweet
      (dbRun as jest.Mock).mockResolvedValue({ lastID: 1 });

      const result = await sweetService.createSweet({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        pricePerKilo: 2.5,
        quantity: 10,
      });

      expect(result).toEqual(mockSweet);
      expect(dbRun).toHaveBeenCalled();
    });

    it('should throw error for invalid data', async () => {
      await expect(
        sweetService.createSweet({
          name: '',
          category: 'Chocolate',
          pricePerKilo: -1,
        })
      ).rejects.toThrow('Invalid sweet data');
    });
  });

  describe('getAllSweets', () => {
    it('should return all sweets', async () => {
      const mockSweets = [
        { id: 1, name: 'Sweet 1', category: 'Category 1', price: 1.0, quantity: 10 },
        { id: 2, name: 'Sweet 2', category: 'Category 2', price: 2.0, quantity: 20 },
      ];

      (dbAll as jest.Mock).mockResolvedValue(mockSweets);

      const result = await sweetService.getAllSweets();

      expect(result).toEqual(mockSweets);
      expect(result.length).toBe(2);
    });
  });

  describe('purchaseSweet', () => {
    it('should decrease quantity when purchasing', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 10,
      };

      const updatedSweet = {
        ...mockSweet,
        quantity: 7,
      };

      // Mock getSweetById calls: first for purchaseSweet, then for updateSweet
      (dbGet as jest.Mock)
        .mockResolvedValueOnce(mockSweet) // First call in purchaseSweet
        .mockResolvedValueOnce(mockSweet) // First call in updateSweet (getSweetById)
        .mockResolvedValueOnce(updatedSweet); // Second call in updateSweet (after update)

      (dbRun as jest.Mock).mockResolvedValue({});

      const result = await sweetService.purchaseSweet(1, 3);

      expect(result?.quantity).toBe(7);
    });

    it('should throw error for insufficient quantity', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 5,
      };

      (dbGet as jest.Mock).mockResolvedValue(mockSweet);

      await expect(sweetService.purchaseSweet(1, 10)).rejects.toThrow(
        'Insufficient quantity in stock'
      );
    });
  });

  describe('searchSweets', () => {
    it('should search sweets by name', async () => {
      const mockSweets = [
        { id: 1, name: 'Chocolate Bar', category: 'Chocolate', price: 2.5, quantity: 10 },
      ];

      (dbAll as jest.Mock).mockResolvedValue(mockSweets);

      const result = await sweetService.searchSweets({ name: 'Chocolate' });

      expect(result).toEqual(mockSweets);
    });
  });
});

