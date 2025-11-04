# Deployment Guide

This guide will help you deploy the Sweet Shop Management System to production.

## Deployment Strategy

- **Frontend:** Deploy to Vercel (recommended) or Netlify
- **Backend:** Deploy to Railway (recommended), Render, or Heroku
- **Database:** SQLite for now (can upgrade to PostgreSQL later)

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - For frontend deployment (free tier available)
3. **Railway/Render Account** - For backend deployment (free tier available)

## Step 1: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sweet Shop Management System

Co-authored-by: Cursor AI <cursor@users.noreply.github.com>"

# Create GitHub repository, then:
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management-system.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend (Railway - Recommended)

### Option A: Railway (Easiest)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables:
   - `PORT` = `3000` (or leave default)
   - `JWT_SECRET` = `your-secret-key-change-in-production`
   - `NODE_ENV` = `production`
6. Railway will automatically deploy
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Build Command:** `npm install && npm run build:backend`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add environment variables (same as Railway)
6. Deploy

## Step 3: Deploy Frontend (Vercel - Recommended)

### Option A: Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" → Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
5. Deploy

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git" → Connect GitHub
3. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
5. Deploy

## Step 4: Update Frontend API URL

After deploying backend, update `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app/api';
```

Or use environment variable in Vercel/Netlify dashboard.

## Step 5: Update README with Live URLs

Update the "Live Demo" section in README.md with your actual URLs.

## Post-Deployment Steps

1. **Seed Database:**
   - Connect to your backend via SSH or use Railway's console
   - Run: `npm run seed`

2. **Create Admin User:**
   - Run: `npm run create-admin`

3. **Test the Application:**
   - Test login/register
   - Test adding items to cart
   - Test admin features

## Troubleshooting

### Backend Issues:
- Check logs in Railway/Render dashboard
- Ensure `PORT` environment variable is set
- Verify database file is writable

### Frontend Issues:
- Check `VITE_API_URL` is correctly set
- Verify CORS is enabled in backend
- Check browser console for errors

### CORS Issues:
- Backend already has CORS enabled
- If issues persist, update `src/server.ts` CORS settings

## Database Considerations

**Current:** SQLite (file-based, works for small deployments)
**Production:** Consider migrating to PostgreSQL for better scalability

For now, SQLite works fine for demo/placement assignments.

---

**Note:** Free tiers have limitations. For production, consider paid plans.

