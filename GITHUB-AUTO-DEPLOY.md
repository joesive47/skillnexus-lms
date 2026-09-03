# GitHub + Vercel Auto-Deploy Setup

## 🚀 Quick Setup (5 minutes)

### 1. Get Vercel Secrets
```bash
# Install Vercel CLI
npm i -g vercel@latest

# Login and get project info
vercel login
vercel link
vercel env pull .env.local
```

### 2. Add GitHub Secrets
Go to: `GitHub Repo → Settings → Secrets and variables → Actions`

Add these secrets:
- `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### 3. Push to GitHub
```bash
git add .
git commit -m "Setup auto-deploy"
git push origin main
```

## ✅ Auto-Deploy Features

- **Production Deploy**: Every push to `main` branch
- **Preview Deploy**: Every pull request
- **Manual Deploy**: GitHub Actions → Run workflow
- **Build Caching**: Faster deployments
- **Environment Sync**: Automatic env variables

## 🔧 Environment Variables

Add these to Vercel Dashboard:
```
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-app.vercel.app
```

## 📊 Monitoring

- **GitHub Actions**: Check deployment status
- **Vercel Dashboard**: Monitor performance
- **Build Logs**: Debug deployment issues

**Status**: ✅ Ready for auto-deployment!