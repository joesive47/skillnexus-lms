# 🔧 Production Environment Variables Checklist

## ✅ Required Variables for uppowerskill.com

Copy these to **Vercel Dashboard → Settings → Environment Variables**

### 🔐 Authentication (CRITICAL)
```bash
NEXTAUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
NEXTAUTH_URL=https://uppowerskill.com
AUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
AUTH_URL=https://uppowerskill.com
AUTH_TRUST_HOST=true
```

### 🌐 Site URLs
```bash
NEXT_PUBLIC_URL=https://uppowerskill.com
NEXTAUTH_URL_INTERNAL=https://uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://uppowerskill.com
```

### 🗄️ Database
```bash
DATABASE_URL=your_production_database_url_here
```

### ⚙️ Environment
```bash
NODE_ENV=production
```

## 🎯 Quick Setup Commands

### 1. Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add NEXTAUTH_URL
# Enter: https://uppowerskill.com

vercel env add AUTH_URL  
# Enter: https://uppowerskill.com

vercel env add NEXTAUTH_SECRET
# Enter: skillnexus-super-secret-key-2024-production-ready

vercel env add AUTH_SECRET
# Enter: skillnexus-super-secret-key-2024-production-ready

vercel env add AUTH_TRUST_HOST
# Enter: true

vercel env add NODE_ENV
# Enter: production

vercel env add NEXT_PUBLIC_URL
# Enter: https://uppowerskill.com

vercel env add DATABASE_URL
# Enter: your_production_database_url
```

### 2. Database Options

**Option A: Vercel Postgres**
```bash
# In Vercel Dashboard
Storage → Create Database → Postgres
# Copy DATABASE_URL automatically
```

**Option B: Supabase (Free)**
```bash
# Go to supabase.com
1. Create project
2. Settings → Database → Connection String
3. Copy to DATABASE_URL
```

**Option C: Neon (Serverless)**
```bash
# Go to neon.tech
1. Create project
2. Copy connection string
3. Add to DATABASE_URL
```

### 3. Deploy & Test
```bash
# Redeploy
vercel --prod

# Test login
curl -I https://uppowerskill.com/login
```

## 🚨 Common Issues & Fixes

### Issue 1: "Invalid URL" Error
```bash
# Check these variables match exactly:
NEXTAUTH_URL=https://uppowerskill.com
AUTH_URL=https://uppowerskill.com
NEXT_PUBLIC_URL=https://uppowerskill.com
```

### Issue 2: Database Connection Error
```bash
# Test database connection
npx prisma studio
# If fails, check DATABASE_URL format
```

### Issue 3: CSRF Token Mismatch
```bash
# Ensure these are set:
AUTH_TRUST_HOST=true
NODE_ENV=production
```

## ✅ Verification Steps

1. **Environment Variables Set** ✓
   - All required variables added to Vercel
   
2. **Database Connected** ✓
   - DATABASE_URL points to production DB
   - Migrations deployed
   
3. **Authentication Working** ✓
   - Can access /login page
   - Can login with test account
   
4. **URLs Correct** ✓
   - All redirects go to uppowerskill.com
   - No localhost references

## 🎯 Test Account
```
Email: admin@skillnexus.com
Password: Admin@123!
```

## 📞 Support
If issues persist:
1. Check Vercel Function logs
2. Verify database connectivity
3. Test with curl/Postman
4. Check browser network tab