# ✅ Production Database Ready - uppowerskill.com

## 🎯 Current Status

✅ **Database:** Prisma Accelerate + PostgreSQL  
✅ **Connection:** `prisma+postgres://accelerate.prisma-data.net/...`  
✅ **Schema:** PostgreSQL compatible  
✅ **Seed API:** Created at `/api/seed-production`

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Verify Vercel Environment Variables

Go to: https://vercel.com/dashboard → Project → Settings → Environment Variables

**Required:**
```env
✅ DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
✅ NEXTAUTH_URL=https://www.uppowerskill.com
✅ NEXT_PUBLIC_URL=https://www.uppowerskill.com
✅ NEXTAUTH_SECRET=<production-secret>
✅ AUTH_SECRET=<production-secret>
✅ SEED_SECRET=uppowerskill-seed-2024
✅ AUTH_TRUST_HOST=true
✅ NODE_ENV=production
```

### Step 2: Run Database Migrations (Local)

```bash
# Run setup script
setup-production-db.bat

# Or manual:
set DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
npx prisma generate
npx prisma db push
```

### Step 3: Seed Production Users

**Option A: Using curl**
```bash
curl -X POST https://www.uppowerskill.com/api/seed-production \
  -H "Content-Type: application/json" \
  -d "{\"secret\":\"uppowerskill-seed-2024\"}"
```

**Option B: Using Browser Console (F12)**
```javascript
fetch('https://www.uppowerskill.com/api/seed-production', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ secret: 'uppowerskill-seed-2024' })
})
.then(r => r.json())
.then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Production users created",
  "users": [
    {"email": "admin@skillnexus.com", "role": "ADMIN"},
    {"email": "teacher@skillnexus.com", "role": "TEACHER"},
    {"email": "student@skillnexus.com", "role": "STUDENT"}
  ]
}
```

---

## 🧪 Test Login

1. Go to: https://www.uppowerskill.com/login
2. Login with:
   - **Email:** admin@skillnexus.com
   - **Password:** Admin@123!
3. Should redirect to: https://www.uppowerskill.com/admin/dashboard

**Other Test Accounts:**
- teacher@skillnexus.com / Admin@123!
- student@skillnexus.com / Admin@123!

---

## 🔍 Troubleshooting

### "Unauthorized" when calling seed API
→ Add `SEED_SECRET=uppowerskill-seed-2024` to Vercel env vars

### "Database connection failed"
→ Check DATABASE_URL is correct in Vercel

### "Users already exist"
→ Database already has users, try login directly

### Login still fails
→ Check Vercel Function Logs:
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View Function Logs
4. Look for error messages

---

## 📊 Prisma Accelerate Benefits

✅ **Connection Pooling** - Handle 1000+ concurrent connections  
✅ **Query Caching** - 10x faster repeated queries  
✅ **Global Edge** - Low latency worldwide  
✅ **Auto-scaling** - No connection limit issues  
✅ **Built-in Monitoring** - Query performance insights

---

## 🔐 Security Notes

1. **Never commit** DATABASE_URL to Git
2. **Rotate** SEED_SECRET after initial setup
3. **Use strong** NEXTAUTH_SECRET (32+ characters)
4. **Enable** 2FA on Vercel account
5. **Monitor** Vercel Function Logs regularly

---

## 📝 Next Steps After Login Works

1. ✅ Test all user roles (Admin, Teacher, Student)
2. ✅ Create real courses and content
3. ✅ Setup payment methods (Stripe/PromptPay)
4. ✅ Configure email notifications
5. ✅ Setup custom domain (if needed)
6. ✅ Enable monitoring and alerts
7. ✅ Remove SEED_SECRET from Vercel

---

## 🎉 Success Checklist

- [ ] Vercel env vars configured
- [ ] Database migrations completed
- [ ] Users seeded successfully
- [ ] Login works for all roles
- [ ] Redirects to correct dashboards
- [ ] No errors in Vercel logs
- [ ] Data persists after redeploy

---

**Status:** 🟢 Ready for Production Testing  
**Database:** Prisma Accelerate + PostgreSQL  
**Deployment:** Auto-deploy enabled on GitHub push
