# 🚀 GitHub + Vercel Auto-Deploy Setup

## ✅ Setup Complete!

Your SkillNexus LMS is now configured for automatic deployment to Vercel when you push to GitHub.

## 🔧 Required Setup Steps

### 1. Get Vercel Tokens
```bash
# Install Vercel CLI
npm i -g vercel

# Login and get tokens
vercel login
vercel link
```

### 2. Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN` - From `vercel --token`
- `VERCEL_ORG_ID` - From `.vercel/project.json`
- `VERCEL_PROJECT_ID` - From `.vercel/project.json`

### 3. Environment Variables
Ensure these are set in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_TRUST_HOST=true`

## 🚀 Auto-Deploy Workflow

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy update"
   git push origin main
   ```

2. **Automatic Process**
   - GitHub Actions triggers
   - Installs dependencies
   - Generates Prisma client
   - Builds project
   - Deploys to Vercel

3. **Live in 2-3 minutes!** 🎉

## 📁 Files Created

- `.github/workflows/vercel-deploy.yml` - Auto-deploy workflow
- `.vercelignore` - Exclude unnecessary files
- `GITHUB-VERCEL-SETUP.md` - This guide

## 🔍 Monitor Deployments

- **GitHub Actions**: Repository → Actions tab
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live Site**: Your Vercel domain

## 🛠️ Quick Commands

```bash
# Force rebuild
git commit --allow-empty -m "Force rebuild"
git push origin main

# Check deployment status
vercel ls

# View logs
vercel logs
```

## ✅ Ready to Deploy!

Your next `git push` will automatically deploy to Vercel! 🚀