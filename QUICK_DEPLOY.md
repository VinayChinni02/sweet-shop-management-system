# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Step 1: Push to GitHub (Required)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Sweet Shop Management System

Co-authored-by: Cursor AI <cursor@users.noreply.github.com>"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management-system.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend (Railway - 5 minutes)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects and deploys
6. Add environment variables:
   - `JWT_SECRET` = any random string (e.g., `my-super-secret-key-123`)
7. Copy your backend URL (e.g., `https://sweet-shop-backend.railway.app`)

### Step 3: Deploy Frontend (Vercel - 3 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your repo
4. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (from Step 2)
6. Deploy

### Step 4: Initialize Database

After backend is deployed, you need to seed the database:

**Option A: Railway Console**
1. Go to Railway dashboard
2. Click on your service → "View Logs"
3. Click "Connect" → "Open Console"
4. Run:
   ```bash
   npm run seed
   npm run create-admin
   ```

**Option B: SSH (if available)**
```bash
railway run npm run seed
railway run npm run create-admin
```

### Step 5: Update README

Update the "Live Demo" section in README.md with your actual URLs.

## ✅ That's It!

Your app should now be live! Test it:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app`

## 🔧 Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend URL is accessible (open in browser)
- Check CORS settings in backend

**Database not working:**
- Make sure you ran `npm run seed` and `npm run create-admin`
- Check Railway logs for errors

**Build fails:**
- Check build logs in Railway/Vercel
- Ensure all dependencies are in `package.json` (not `devDependencies`)

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.

