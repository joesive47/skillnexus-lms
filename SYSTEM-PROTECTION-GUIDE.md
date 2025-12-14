# 🛡️ คู่มือป้องกันระบบพัง - SkillNexus LMS

## ⚠️ กฎเหล็ก - ห้ามทำเด็ดขาด

### 🚫 **ห้ามลบไฟล์สำคัญ**
```bash
# ไฟล์เหล่านี้ห้ามลบ
prisma/schema.prisma     # Database schema
.env                     # Environment variables
package.json             # Dependencies
next.config.js           # Next.js config
vercel.json             # Deployment config
src/lib/prisma.ts       # Database connection
src/auth.ts             # Authentication
```

### 🚫 **ห้ามแก้ไขโดยไม่สำรอง**
```bash
# สำรองก่อนแก้ไข
cp file.ts file.ts.backup
git add . && git commit -m "Backup before changes"
```

## 🔒 **ขั้นตอนป้องกัน**

### 1. **Git Protection**
```bash
# สร้าง branch ใหม่เสมอ
git checkout -b feature/new-feature
git add .
git commit -m "Safe changes"
git push origin feature/new-feature
```

### 2. **Database Protection**
```bash
# Backup database ก่อนแก้ไข
npx prisma db pull
cp prisma/schema.prisma prisma/schema.backup.prisma
```

### 3. **Environment Protection**
```bash
# สำรอง .env
cp .env .env.backup
# ใช้ .env.example เป็น template
```

## 🚨 **Emergency Recovery**

### **ถ้าระบบพัง - ทำทันที**
```bash
# 1. กลับไป commit ล่าสุดที่ทำงาน
git reset --hard HEAD~1

# 2. กู้คืนไฟล์สำคัญ
git checkout HEAD -- prisma/schema.prisma
git checkout HEAD -- package.json
git checkout HEAD -- .env

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Reset database
npx prisma generate
npx prisma db push
```

### **ถ้า Build ล้มเหลว**
```bash
# 1. ตรวจสอบ errors
npm run build 2>&1 | tee build.log

# 2. แก้ไข TypeScript errors
npm run lint --fix

# 3. Clean build
rm -rf .next
npm run build
```

## 🛠️ **Safe Development Practices**

### **ก่อนแก้ไขอะไร**
```bash
# 1. สร้าง backup
git stash push -m "Before changes"

# 2. ทดสอบ build
npm run build

# 3. ทดสอบ local
npm run dev
```

### **หลังแก้ไข**
```bash
# 1. ทดสอบทันที
npm run build
npm run dev

# 2. Commit เล็กๆ บ่อยๆ
git add .
git commit -m "Small safe change"

# 3. Push เป็นระยะ
git push origin main
```

## 🔧 **Quick Fix Commands**

### **แก้ไข Dependencies**
```bash
# ถ้า npm install ล้มเหลว
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# ถ้า Prisma error
npx prisma generate --force
npx prisma db push --force-reset
```

### **แก้ไข Build Errors**
```bash
# TypeScript errors
npm install @types/node @types/react @types/react-dom

# Missing dependencies
npm install bcryptjs qrcode mime-types

# Prisma errors
npx prisma generate
```

## 📋 **Pre-Deploy Checklist**

### **ก่อน Deploy เสมอ**
- [ ] `npm run build` ผ่าน
- [ ] `npm run lint` ไม่มี error
- [ ] ทดสอบ local ทำงาน
- [ ] Backup database
- [ ] Commit ทุกการเปลี่ยนแปลง

### **Environment Variables ครบ**
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `AUTH_SECRET`

## 🚑 **Emergency Contacts**

### **ถ้าระบบพังหนัก**
1. **Stop Deploy**: ไป Vercel Dashboard → Cancel deployment
2. **Rollback**: Deploy commit ล่าสุดที่ทำงาน
3. **Check Logs**: Vercel → Functions → View logs
4. **Database**: ตรวจสอบ DATABASE_URL

### **Recovery Commands**
```bash
# กู้คืนทั้งหมด
git reset --hard origin/main
npm install
npx prisma generate
npm run build

# Deploy commit ที่ทำงาน
git log --oneline -10
git reset --hard <working-commit-hash>
git push --force origin main
```

## 🎯 **Best Practices**

### **Development Workflow**
1. **Branch** → **Code** → **Test** → **Commit** → **Push** → **PR** → **Merge**
2. **เทสต์ local เสมอ** ก่อน push
3. **Commit เล็กๆ บ่อยๆ** แทนการ commit ใหญ่
4. **Backup สำคัญ** ก่อนแก้ไขใหญ่

### **Never Do This**
- ❌ แก้ไข production database โดยตรง
- ❌ ลบ .git folder
- ❌ Force push โดยไม่แน่ใจ
- ❌ แก้ไขหลายไฟล์พร้อมกัน
- ❌ Skip testing

---

## 🏆 **Remember: Prevention > Recovery**

**"Better safe than sorry" - สำรองก่อน แก้ไขทีละนิด ทดสอบบ่อยๆ**

**🛡️ ระบบปลอดภัย = ธุรกิจยั่งยืน**