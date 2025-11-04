import { AuthService } from '../services/authService';
import { dbRun, dbGet } from '../db/database';
import bcrypt from 'bcryptjs';

jest.mock('../db/database');
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (dbGet as jest.Mock).mockResolvedValue(undefined);
      (dbRun as jest.Mock).mockResolvedValue({ lastID: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe('user');
      expect(result.token).toBeDefined();
      expect(dbGet).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@example.com']);
      expect(dbRun).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      (dbGet as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      (dbGet as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      (dbGet as jest.Mock).mockResolvedValue(undefined);

      await expect(
        authService.login('wrong@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      (dbGet as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login('test@example.com', 'wrongPassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});

