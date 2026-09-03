# 🎯 SCORM 2004 Quick Reference

## 📦 ไฟล์ที่ต้อง Deploy

### 1. Seed Scripts (ใน prisma/)
```
✅ seed.ts                        - Users + Sample Course
✅ seed-world-change-courses.ts   - 5 หลักสูตร SCORM 2004
✅ seed-certification.ts          - ระบบใบรับรอง
✅ seed-badges.ts                 - ระบบ Badges
✅ verify-courses.ts              - ตรวจสอบหลักสูตร
```

### 2. SCORM Packages (ใน public/scorm/)
```
📦 sdgs-leadership-2030.zip
📦 circular-economy-zero-waste.zip
📦 social-entrepreneurship-impact.zip
📦 renewable-energy-cleantech.zip
📦 regenerative-agriculture-food.zip
```

---

## ⚡ Quick Deploy (3 Commands)

```bash
# 1. Push Schema
npx prisma db push

# 2. Seed Basic + SCORM Courses
npx prisma db seed && npx tsx prisma/seed-world-change-courses.ts

# 3. Verify
npx tsx prisma/verify-courses.ts
```

---

## 🌍 5 หลักสูตร SCORM 2004

| # | Course | Duration | Price | Slug |
|---|--------|----------|-------|------|
| 1 | 🎯 SDGs Leadership | 8h | ฿4,999 | `sdgs-leadership-2030` |
| 2 | ♻️ Circular Economy | 6h | ฿3,999 | `circular-economy-zero-waste` |
| 3 | 💡 Social Entrepreneurship | 7h | ฿4,499 | `social-entrepreneurship-impact` |
| 4 | ⚡ Renewable Energy | 6.5h | ฿3,799 | `renewable-energy-cleantech` |
| 5 | 🌱 Regenerative Agriculture | 6.3h | ฿3,599 | `regenerative-agriculture-food` |

**Total:** 33.8 hours | 60 lessons | ฿20,796

---

## 🔑 Test Accounts

```
Admin:   admin@skillnexus.com / Admin@123!
Teacher: teacher@skillnexus.com / Teacher@123!
Student: joesive47@gmail.com / Student@123! (1000 credits)
```

---

## 📍 URLs

```
Local:      http://localhost:3000
Courses:    /dashboard/courses
Assessment: /skills-assessment
Admin:      /dashboard/admin
```

---

## 🚀 Vercel Deploy

```bash
# 1. Push to GitHub
git add .
git commit -m "Add SCORM 2004 courses"
git push origin main

# 2. Deploy on Vercel
https://vercel.com/new

# 3. Add Environment Variables
DATABASE_URL=your-postgres-url
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.vercel.app

# 4. Run Seed on Production
vercel env pull .env.production.local
npx prisma db push
npx prisma db seed
npx tsx prisma/seed-world-change-courses.ts
```

---

## 📚 Documentation

- 📖 [SCORM-DEPLOYMENT.md](./SCORM-DEPLOYMENT.md) - Full Guide
- 🌍 [WORLD-CHANGE-COURSES.md](./WORLD-CHANGE-COURSES.md) - Course Details
- 🚀 [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) - Deploy in 5 min
- ✅ [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - Checklist

---

**🎉 Ready to Deploy! 🚀**
