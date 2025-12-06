# 🚀 AWS Amplify Deployment - SkillNexus LMS

## ง่ายที่สุดใน AWS! (10 นาที)

---

## 📋 ข้อมูล

- **Database:** postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres
- **Account:** joesive@gmail.com

---

## 🚀 Deploy Steps

### Step 1: Push to GitHub (2 นาที)

```powershell
cd c:\API\The-SkillNexus

git add .
git commit -m "Deploy to AWS Amplify"
git push origin main
```

---

### Step 2: Deploy to AWS Amplify (5 นาที)

1. **ไปที่ AWS Amplify:**
   ```
   https://console.aws.amazon.com/amplify
   ```

2. **Login/Sign up** (ใช้ email: joesive@gmail.com)

3. **คลิก "New app" → "Host web app"**

4. **Connect GitHub:**
   - เลือก "GitHub"
   - Authorize AWS Amplify
   - เลือก repository: `The-SkillNexus`
   - Branch: `main`
   - คลิก "Next"

5. **Configure build settings:**
   - App name: `skillnexus-lms`
   - Environment: `production`
   - Build settings จะถูกตั้งค่าอัตโนมัติ
   - คลิก "Next"

6. **Review และ Deploy:**
   - คลิก "Save and deploy"
   - รอ 5-10 นาที ☕

---

### Step 3: Add Environment Variables (2 นาที)

1. **ไปที่ App settings → Environment variables**

2. **Add variables:**

```
DATABASE_URL
postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

NEXTAUTH_SECRET
hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

AUTH_SECRET
hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

NEXTAUTH_URL
https://main.xxxxx.amplifyapp.com

AUTH_URL
https://main.xxxxx.amplifyapp.com

NEXT_PUBLIC_URL
https://main.xxxxx.amplifyapp.com

AUTH_TRUST_HOST
true

NODE_ENV
production
```

3. **คลิก "Save"**

4. **Redeploy:**
   - ไปที่ "Deployments"
   - คลิก "Redeploy this version"

---

### Step 4: Run Migrations (2 นาที)

```powershell
# ใน local terminal
$env:DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"

npx prisma migrate deploy
npm run db:seed
```

---

## ✅ เสร็จแล้ว! 🎉

**URL:** https://main.xxxxx.amplifyapp.com

**Login:**
- Email: `admin@skillnexus.com`
- Password: `Admin@123!`

---

## 🎯 Custom Domain (Optional)

1. **ไปที่ App settings → Domain management**
2. **คลิก "Add domain"**
3. **ใส่:** `www.uppowerskill.com`
4. **Update DNS records** ตามที่ AWS บอก
5. **รอ 5-30 นาที**
6. **SSL auto-generated!** ✅

---

## 💰 ค่าใช้จ่าย

### AWS Amplify Pricing:
- **Build minutes:** $0.01/minute
- **Hosting:** $0.15/GB served
- **Free Tier:** 
  - 1,000 build minutes/month
  - 15 GB served/month

### ประมาณการ:
- **Small app:** $0-5/month
- **Medium app:** $5-15/month
- **Large app:** $15-30/month

### Database (Supabase):
- **Free forever:** $0/month

**รวม: $0-15/month**

---

## 🔧 Useful Features

### Auto Deploy:
- Push to GitHub → Auto deploy ✅

### Preview Deployments:
- Pull requests → Preview URL ✅

### Monitoring:
- Real-time logs
- Performance metrics
- Error tracking

### Rollback:
- One-click rollback to previous version

---

## 📊 Monitor Your App

### View Logs:
```
App settings → Monitoring → Logs
```

### View Metrics:
```
App settings → Monitoring → Metrics
```

### View Deployments:
```
Deployments tab
```

---

## 🆘 Troubleshooting

### Build Failed:
1. ไปที่ "Deployments"
2. คลิก failed deployment
3. ดู build logs
4. แก้ไขปัญหา
5. Push to GitHub → Auto redeploy

### Environment Variables Not Working:
1. ตรวจสอบว่าเพิ่มครบทุกตัว
2. Redeploy app
3. Clear cache

### Database Connection Error:
```powershell
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"
```

---

## 💡 Tips

### ประหยัดค่าใช้จ่าย:
- ใช้ Supabase (ฟรี) สำหรับ database
- Enable caching
- Optimize images

### เพิ่ม Performance:
- Enable CDN (default)
- Use Next.js Image Optimization
- Enable compression

### Security:
- Use environment variables สำหรับ secrets
- Enable HTTPS (default)
- Regular security updates

---

## 📝 Checklist

- [ ] Push code to GitHub
- [ ] Create AWS account
- [ ] Deploy to Amplify
- [ ] Add environment variables
- [ ] Run database migrations
- [ ] Test application
- [ ] (Optional) Setup custom domain
- [ ] Setup monitoring

---

## 🎉 Success!

Your SkillNexus LMS is now live on AWS Amplify!

**Features:**
- ✅ Auto deploy from GitHub
- ✅ HTTPS/SSL included
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Easy rollback
- ✅ Real-time monitoring

---

**AWS Amplify = ง่าย + เร็ว + Scalable! 🚀**
