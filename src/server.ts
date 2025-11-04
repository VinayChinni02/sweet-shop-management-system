import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow frontend URLs
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development, specific URL in production
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/orders', orderRoutes);

// Root route - provide helpful info
app.get('/', (req, res) => {
  res.json({
    message: 'Sweet Shop Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      sweets: '/api/sweets',
      orders: '/api/orders (admin only)',
    },
    frontend: 'http://localhost:5173',
    documentation: 'See README.md for API documentation'
  });
});

// Favicon route to prevent 404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

export default app;

