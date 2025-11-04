# GitHub Commands - Copy & Paste Ready

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `sweet-shop-management-system`
3. Description: `Full-stack Sweet Shop Management System with TDD`
4. Choose **Public**
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click "Create repository"

## Step 2: Connect and Push (Run in Git Bash)

After creating the repository, **replace YOUR_USERNAME** with your actual GitHub username:

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management-system.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## If Authentication Fails

If you get authentication errors, use a Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Name it: "Sweet Shop Project"
4. Select expiration (30 days or 90 days)
5. Check scope: `repo` (all)
6. Generate token
7. **Copy the token** (you won't see it again!)
8. When pushing, use your GitHub username and the token as password

## Alternative: SSH (If you have SSH key set up)

```bash
# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/sweet-shop-management-system.git

# Push
git push -u origin main
```

## Your Current Git Config

✅ Name: VinayChinni02  
✅ Email: vinayaug02@gmail.com  
✅ Repository initialized  
✅ Initial commit ready

---

**After pushing, your code will be on GitHub and ready for deployment!**

