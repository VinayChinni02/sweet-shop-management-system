# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Repository name: `sweet-shop-management-system`
4. Description: "Full-stack Sweet Shop Management System with TDD"
5. Choose **Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management-system.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/sweet-shop-management-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Connection

After pushing, check your GitHub repository - you should see all your files!

## Authentication

If you get authentication errors:

**Option 1: Personal Access Token (Recommended)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (all)
4. Copy the token
5. Use token as password when pushing

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI, then:
gh auth login
```

## Your Git Configuration

- **Name:** VinayChinni02
- **Email:** vinayaug02@gmail.com

These are already configured correctly!

---

**Next Steps:** After pushing to GitHub, follow `QUICK_DEPLOY.md` to deploy your application.

