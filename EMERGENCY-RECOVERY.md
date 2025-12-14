# 🚨 Emergency Recovery - SkillNexus LMS

## 🆘 **ระบบพัง - ทำทันที!**

### **Step 1: Stop Everything**
```bash
# หยุด development server
Ctrl + C

# Cancel Vercel deployment (ถ้ากำลัง deploy)
# ไป https://vercel.com/dashboard → Cancel
```

### **Step 2: Assess Damage**
```bash
# ตรวจสอบสถานะ Git
git status
git log --oneline -5

# ตรวจสอบ build
npm run build
```

### **Step 3: Quick Recovery**
```bash
# กู้คืนไป commit ล่าสุดที่ทำงาน
git reset --hard HEAD~1

# หรือกู้คืนไปยัง commit เฉพาะ
git reset --hard 6516b304  # commit hash ที่ทำงาน
```

## 🔧 **Common Fixes**

### **Build Failed**
```bash
# Clean everything
rm -rf .next node_modules package-lock.json
npm install
npx prisma generate
npm run build
```

### **Database Error**
```bash
# Reset Prisma
npx prisma generate --force
npx prisma db push --force-reset
npm run db:seed
```

### **TypeScript Error**
```bash
# Install missing types
npm install @types/bcryptjs @types/qrcode @types/mime-types

# Fix imports
# Change: import bcrypt from 'bcryptjs'
# To: import * as bcrypt from 'bcryptjs'
```

### **Vercel Deploy Failed**
```bash
# Force redeploy working commit
git reset --hard <working-commit>
git push --force origin main
```

## 📞 **Emergency Checklist**

- [ ] **Stop all processes**
- [ ] **Check git status**
- [ ] **Identify last working commit**
- [ ] **Reset to working state**
- [ ] **Test locally**
- [ ] **Redeploy**

## 🎯 **Prevention for Next Time**

```bash
# Always backup before changes
git stash push -m "Before risky changes"

# Test before commit
npm run build && npm run dev

# Small commits
git add . && git commit -m "Small safe change"
```

**🛡️ Remember: Better safe than sorry!**