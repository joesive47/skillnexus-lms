# 🚀 Vercel Redeploy Guide

## ✅ Code Pushed to GitHub Successfully!

Commit: `Fix: Login redirect to localhost instead of external domain`

---

## 🔄 Automatic Redeploy (Recommended)

Vercel จะ deploy อัตโนมัติเมื่อ push ไป GitHub:

1. ✅ Code pushed to `main` branch
2. ⏳ Vercel detecting changes...
3. 🔨 Building and deploying...
4. ✅ Live in ~2-3 minutes

**Check deployment status:**
- Dashboard: https://vercel.com/dashboard
- Or wait for email notification

---

## 🔧 Manual Redeploy (If Needed)

### Option 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## ⚙️ Environment Variables Check

Make sure these are set in Vercel:

```env
# Production URLs (NOT localhost!)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_URL=https://your-domain.vercel.app
AUTH_URL=https://your-domain.vercel.app

# Secrets
NEXTAUTH_SECRET=your-production-secret
AUTH_SECRET=your-production-secret

# Database
DATABASE_URL=your-production-database-url

# Other settings
AUTH_TRUST_HOST=true
NODE_ENV=production
```

**Update environment variables:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update values
3. Redeploy

---

## 🧪 Test After Deploy

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Test login** with production URL
3. **Verify redirect** goes to correct dashboard
4. **Check console** for any errors

**Expected behavior:**
- Login → Redirect to `/admin/dashboard` or `/student/dashboard`
- No external domain redirects
- Session persists correctly

---

## 🐛 Troubleshooting

### Still redirecting to wrong domain?
1. Check Vercel environment variables
2. Clear Vercel build cache: Settings → General → Clear Build Cache
3. Force redeploy

### Login not working?
1. Check DATABASE_URL is correct
2. Verify NEXTAUTH_SECRET matches
3. Check logs: Vercel Dashboard → Deployments → View Function Logs

---

## 📝 Changes in This Deploy

✅ Fixed auth callback redirect logic
✅ Updated next.config.js for proper URL handling
✅ Removed external domain references
✅ Added debug logging for troubleshooting

---

**Deployment Status:** 🟢 Ready to Deploy
**Estimated Time:** 2-3 minutes
**Auto-deploy:** Enabled
