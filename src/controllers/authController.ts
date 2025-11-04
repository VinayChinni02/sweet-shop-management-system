import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { body, validationResult } from 'express-validator';

const authService = new AuthService();

export const registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((value) => {
      if (!value.endsWith('@gmail.com')) {
        throw new Error('Email must be a Gmail address (@gmail.com)');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('+91')) {
        throw new Error('Phone number must start with +91');
      }
      if (value && value.length < 13) {
        throw new Error('Phone number must be at least 10 digits after +91');
      }
      if (value && !/^\+91[0-9]{10}$/.test(value)) {
        throw new Error('Phone number must be in format +91XXXXXXXXXX (10 digits after +91)');
      }
      return true;
    }),
];

export const loginValidators = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, name, phone } = req.body;
    const result = await authService.register({ email, password, name, phone });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};

