# ▲ Vercel Deployment (100% Free)

## Option 1: Web UI (แนะนำ - ง่ายสุด)

### 1. Push to GitHub
```powershell
git add .
git commit -m "Deploy to Vercel"
git push
```

### 2. Deploy
1. ไปที่: **https://vercel.com**
2. **Sign Up** with GitHub (Free)
3. **Add New Project**
4. **Import** The-SkillNexus repo
5. **Deploy** (คลิกเดียว!)

### 3. Add Environment Variables
ใน Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

### 4. Redeploy
คลิก **Redeploy** ใน Deployments tab

✅ Done! URL: `https://your-app.vercel.app`

---

## Option 2: CLI

```powershell
# Install
npm i -g vercel

# Login
npx vercel login

# Deploy
npx vercel --prod
```

---

## Free Tier Limits
- ✅ 100GB Bandwidth
- ✅ Unlimited Deployments
- ✅ Auto HTTPS + CDN
- ✅ No Credit Card Required

## Database Options

### Option A: Vercel Postgres (แนะนำ)
1. ใน Vercel Dashboard → Storage
2. Create → Postgres
3. Connect to Project
4. Done! (Auto set `DATABASE_URL`)

### Option B: Neon (Free PostgreSQL)
1. ไปที่: https://neon.tech
2. Sign up (Free)
3. Create Database
4. Copy connection string
5. Add to Vercel env vars

### Option C: Supabase (Free)
1. ไปที่: https://supabase.com
2. New Project
3. Copy Database URL
4. Add to Vercel

---

## Auto Deploy
ทุกครั้งที่ push GitHub → Vercel deploy อัตโนมัติ!

```powershell
git add .
git commit -m "Update"
git push
```

---

## 🎯 Recommended: Vercel + Neon
- ✅ Both 100% Free
- ✅ No Credit Card
- ✅ Perfect for Next.js
- ✅ Auto scaling

Deploy เลย! 🚀
