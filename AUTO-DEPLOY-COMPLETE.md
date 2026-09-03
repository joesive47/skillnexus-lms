# 🚀 Auto-Deploy Setup - ครบทุกอย่าง

## เริ่มใช้งาน (3 ขั้นตอน)

### 1. รัน Setup Script
```bash
setup-complete.bat
```

### 2. เพิ่ม GitHub Secrets
ไปที่: `GitHub Repo → Settings → Secrets and variables → Actions`

เพิ่ม 3 secrets:
- `VERCEL_TOKEN` - จาก https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - จาก script ด้านบน
- `VERCEL_PROJECT_ID` - จาก script ด้านบน

### 3. Push ไป GitHub
```bash
git add .
git commit -m "setup auto-deploy"
git push origin main
```

## ✅ คุณสมบัติ Auto-Deploy

- **Production**: ทุกครั้งที่ push ไป main
- **Preview**: ทุก Pull Request
- **Manual**: GitHub Actions → Run workflow
- **Fast Build**: Prisma + Next.js optimized

## 🔧 Environment Variables

เพิ่มใน Vercel Dashboard:
```
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

## 📊 ตรวจสอบ

- **GitHub Actions**: ดู deployment status
- **Vercel Dashboard**: ดู performance
- **Live Site**: https://your-app.vercel.app

**สถานะ**: ✅ พร้อม Auto-Deploy แล้ว!