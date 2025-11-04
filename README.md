# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built with **Test-Driven Development (TDD)** methodology. This application provides a robust RESTful API backend and a modern React frontend for managing a sweet shop inventory.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [My AI Usage](#my-ai-usage)

## 🎯 Project Overview

This project demonstrates:
- **Test-Driven Development (TDD)** with Red-Green-Refactor patterns
- Clean coding practices following SOLID principles
- Modern full-stack development with TypeScript
- Secure authentication using JWT tokens

**Key Features:**
- User registration and authentication with role-based access
- Shopping cart and payment system
- Admin panel for inventory management and order tracking
- Each sweet has unique ID, unique name, category, price, and quantity

## 🛠 Technology Stack

**Backend:** Node.js, Express.js, TypeScript, SQLite, JWT, Jest  
**Frontend:** React 19, TypeScript, Vite, React Router, Axios

## 📁 Project Structure

```
sweet-shop-management-system/
├── src/                          # Backend source code
│   ├── __tests__/               # Test files
│   │   ├── authService.test.ts
│   │   └── sweetService.test.ts
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts
│   │   ├── sweetController.ts
│   │   └── orderController.ts
│   ├── db/                      # Database setup
│   │   └── database.ts
│   ├── middleware/              # Express middleware
│   │   └── auth.ts
│   ├── models/                  # TypeScript interfaces
│   │   ├── User.ts
│   │   └── Sweet.ts
│   ├── routes/                  # API routes
│   │   ├── authRoutes.ts
│   │   ├── sweetRoutes.ts
│   │   └── orderRoutes.ts
│   ├── services/                # Business logic
│   │   ├── authService.ts
│   │   ├── sweetService.ts
│   │   └── purchaseService.ts
│   ├── scripts/                 # Utility scripts
│   │   ├── seedSweets.ts
│   │   ├── createAdmin.ts
│   │   ├── viewDatabase.ts
│   │   └── queryDb.ts
│   └── server.ts                # Entry point
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── UserNavbar.tsx
│   │   │   ├── AdminNavbar.tsx
│   │   │   ├── SweetCard.tsx
│   │   │   ├── AdminSweetCard.tsx
│   │   │   ├── SweetForm.tsx
│   │   │   └── AdminOrders.tsx
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Payment.tsx
│   │   ├── services/           # API client
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── package.json                 # Root package.json
├── jest.config.js               # Jest configuration
├── tsconfig.json                # TypeScript configuration
├── sweet_shop.db                # SQLite database (auto-generated)
└── README.md                    # This file
```

## ✨ Features

### User Interface
- **Separate User Navigation:** Dedicated navbar with cart icon and item count
- **Browse & Search:** View all sweets with search by name, category, or price range
- **Quantity Selection:** Choose 250g, 500g, or 1kg with automatic price calculation
- **Shopping Cart:** Add items to cart, view cart, and adjust quantities
- **Payment System:** Multiple payment methods (Card, UPI, Cash on Delivery)
- **Auto-redirect:** Automatic redirection to user dashboard after login
- **Real-time Updates:** Inventory quantities update in real-time

### Admin Interface
- **Separate Admin Navigation:** Dedicated admin navbar with admin-specific links
- **Inventory Management:** Full CRUD operations (Create, Read, Update, Delete sweets)
- **Price Management:** Set price per kilogram for each sweet
- **Stock Control:** Restock inventory and set items to out-of-stock
- **Order Management:** View all user orders with customer and sweet details
- **Tab Navigation:** Switch between "Inventory" and "Orders" tabs
- **Security:** Sensitive user data (passwords) never exposed in admin panel
- **Auto-redirect:** Automatic redirection to admin dashboard after admin login

### Important Points
- **Role-Based Access:** Different interfaces for admin and regular users
- **Unique Sweet Names:** Each sweet must have a unique name (enforced at database level)
- **Security:** User passwords are never returned in API responses
- **Shopping Cart:** Persisted in browser localStorage
- **Order Tracking:** All purchases are recorded in the database
- **JWT Authentication:** Secure token-based authentication for all protected routes

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
The login interface with user registration option.

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)
User dashboard showing available sweets with search and filter functionality.

### Shopping Cart
![Shopping Cart](screenshots/cart.png)
Shopping cart with items and total price calculation.

### Payment Page
![Payment Page](screenshots/payment.png)
Payment page with multiple payment method options (Card, UPI, COD).

### Admin Dashboard - Inventory
![Admin Dashboard](screenshots/admin-dashboard.png)
Admin dashboard for managing sweets inventory with CRUD operations.

### Admin Dashboard - Orders
![Admin Orders](screenshots/admin-orders.png)
Admin view showing all user orders and purchase history.

**Note:** Add your screenshots in a `screenshots/` folder in the project root and update the image paths above.

## 🌐 Live Demo

**Live Application:** [View Live Demo](https://your-app-url.vercel.app)

**Backend API:** [API Endpoint](https://your-backend-url.railway.app)

**Note:** 
- Frontend deployed on: Vercel
- Backend API hosted on: Railway
- Demo credentials:
  - Admin: `admin@example.com` / `admin123`
  - User: Register a new account

*Update the URLs above after deployment. See `QUICK_DEPLOY.md` for deployment instructions.*

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+) and npm (v9+)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Seed database and create admin:**
   ```bash
   npm run seed
   npm run create-admin
   ```
   Default admin: `admin@example.com` / `admin123`

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start both servers
- `npm run test:backend` - Run backend tests
- `npm run seed` - Seed sample sweets
- `npm run create-admin` - Create admin user
- `npm run view-db` - View database contents
- `npm run query-db` - Execute custom SQL queries

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)

### Sweets (Protected - Require JWT Token)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search?name=...&category=...` - Search sweets
- `POST /api/sweets` - Create sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)
- `DELETE /api/sweets/:id` - Delete sweet (Admin)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

### Orders (Admin Only)
- `GET /api/orders` - Get all orders

**Note:** All endpoints require `Authorization: Bearer <token>` header except register/login.

## 🧪 Testing

This project follows **TDD methodology** with tests written before implementation.

**Run tests:**
```bash
npm run test:backend
```

**Test Coverage:**
- Auth Service: 5 tests (registration, login, error handling)
- Sweet Service: 6 tests (CRUD, search, purchase, restock)
- All tests passing ✅

See `TEST_REPORT.md` for detailed results.

## 🤖 My AI Usage

I used **Cursor AI** as a development assistant throughout this project. Here's how:

### How I Used AI

**Code Assistance:**
- Generated boilerplate code for React components and TypeScript interfaces
- Helped with TypeScript type definitions and error fixes
- Suggested code structure and best practices

**Testing:**
- Assisted in writing test cases following TDD principles
- I reviewed and refined all AI-generated tests to ensure proper coverage

**Documentation:**
- Helped generate API documentation and README sections

### My Approach

- **I maintained full ownership** of the codebase and architecture decisions
- **I reviewed and understood** every line of code, including AI-generated portions
- **I customized** all AI suggestions to match project requirements
- **I tested thoroughly** all implementations before committing

### Git Co-Authorship

For commits where AI was used, I added co-author attribution:
```
Co-authored-by: Cursor AI <cursor@users.noreply.github.com>
```

**Reflection:** AI served as a helpful pair programming tool, accelerating development while I maintained complete understanding and control of the codebase.

---

## 📝 Notes

- Database file `sweet_shop.db` is created automatically
- Each sweet must have unique ID, unique name, category, price, and quantity
- User passwords are never exposed in API responses
- Shopping cart persists in browser localStorage

**Built with ❤️ using Test-Driven Development**
