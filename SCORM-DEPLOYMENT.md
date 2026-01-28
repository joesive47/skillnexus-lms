# 🚀 SCORM 2004 Deployment Guide

## 📦 ไฟล์ SCORM 2004 ทั้งหมด

### 📍 ตำแหน่งไฟล์สำคัญ

```
The-SkillNexus/
├── prisma/
│   ├── seed.ts                          # ✅ Seed หลัก (Users, Sample Course)
│   ├── seed-world-change-courses.ts     # 🌍 5 หลักสูตรเปลี่ยนแปลงโลก
│   ├── seed-certification.ts            # 🎓 ระบบใบรับรอง
│   ├── seed-badges.ts                   # 🏆 ระบบ Badges
│   └── verify-courses.ts                # ✅ ตรวจสอบหลักสูตร
│
├── WORLD-CHANGE-COURSES.md              # 📖 คู่มือหลักสูตร 5 คอร์ส
└── SCORM-DEPLOYMENT.md                  # 📄 ไฟล์นี้
```

---

## 🌍 หลักสูตร SCORM 2004 ทั้งหมด (5 คอร์ส)

### 1. 🎯 SDGs Leadership (8 ชม. | ฿4,999)
```bash
Slug: sdgs-leadership-2030
SCORM: /scorm/sdgs-leadership-2030.zip
Modules: 4 | Lessons: 12
```

### 2. ♻️ Circular Economy (6 ชม. | ฿3,999)
```bash
Slug: circular-economy-zero-waste
SCORM: /scorm/circular-economy-zero-waste.zip
Modules: 4 | Lessons: 12
```

### 3. 💡 Social Entrepreneurship (7 ชม. | ฿4,499)
```bash
Slug: social-entrepreneurship-impact
SCORM: /scorm/social-entrepreneurship-impact.zip
Modules: 4 | Lessons: 12
```

### 4. ⚡ Renewable Energy (6.5 ชม. | ฿3,799)
```bash
Slug: renewable-energy-cleantech
SCORM: /scorm/renewable-energy-cleantech.zip
Modules: 4 | Lessons: 12
```

### 5. 🌱 Regenerative Agriculture (6.3 ชม. | ฿3,599)
```bash
Slug: regenerative-agriculture-food
SCORM: /scorm/regenerative-agriculture-food.zip
Modules: 4 | Lessons: 12
```

**รวม:** 33.8 ชั่วโมง | 20 Modules | 60 Lessons | มูลค่า ฿20,796

---

## 🚀 Deploy ไปยัง Production

### Step 1: เตรียม Database (Vercel/Supabase/Neon)

```bash
# 1. สร้าง PostgreSQL Database
# - Vercel Postgres: https://vercel.com/storage/postgres
# - Supabase: https://supabase.com
# - Neon: https://neon.tech

# 2. Copy DATABASE_URL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Step 2: Setup Environment Variables

```bash
# .env.production
DATABASE_URL="your-postgres-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### Step 3: Push Schema & Seed Data

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push Schema to Production
npx prisma db push

# 3. Seed ข้อมูลพื้นฐาน (Users, Sample Course)
npx prisma db seed

# 4. Seed หลักสูตร SCORM 2004 (5 คอร์ส)
npx tsx prisma/seed-world-change-courses.ts

# 5. Seed ระบบใบรับรอง (Optional)
npx tsx prisma/seed-certification.ts

# 6. Seed ระบบ Badges (Optional)
npx tsx prisma/seed-badges.ts
```

### Step 4: Verify Deployment

```bash
# ตรวจสอบว่าหลักสูตรถูกสร้างแล้ว
npx tsx prisma/verify-courses.ts

# Expected Output:
# ✅ Found 5 courses:
# 1. Sustainable Development Goals (SDGs) Leadership
# 2. Circular Economy & Zero Waste Innovation
# 3. Social Entrepreneurship & Impact Investing
# 4. Renewable Energy & Clean Technology
# 5. Regenerative Agriculture & Food Systems
```

---

## 📦 SCORM Package Structure

```
public/scorm/
├── sdgs-leadership-2030/
│   ├── index.html
│   ├── imsmanifest.xml
│   └── content/
│       ├── module-1/
│       ├── module-2/
│       ├── module-3/
│       └── module-4/
│
├── circular-economy-zero-waste/
├── social-entrepreneurship-impact/
├── renewable-energy-cleantech/
└── regenerative-agriculture-food/
```

### SCORM 2004 Manifest Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="SDG_LEADERSHIP_2030" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  
  <organizations default="ORG-001">
    <organization identifier="ORG-001">
      <title>SDGs Leadership Course</title>
      <item identifier="ITEM-001" identifierref="RES-001">
        <title>Module 1: Understanding SDGs Framework</title>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-001" type="webcontent" 
      adlcp:scormType="sco" href="content/module-1/index.html">
      <file href="content/module-1/index.html"/>
    </resource>
  </resources>
</manifest>
```

---

## 🎯 Quick Deploy Commands

### Option 1: Deploy ทั้งหมดพร้อมกัน

```bash
# สร้างไฟล์ deploy-all.sh
cat > deploy-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying SkillNexus LMS with SCORM 2004..."

# 1. Generate Prisma Client
npx prisma generate

# 2. Push Schema
npx prisma db push

# 3. Seed All Data
npx prisma db seed
npx tsx prisma/seed-world-change-courses.ts
npx tsx prisma/seed-certification.ts
npx tsx prisma/seed-badges.ts

# 4. Verify
npx tsx prisma/verify-courses.ts

echo "✅ Deployment Complete!"
EOF

chmod +x deploy-all.sh
./deploy-all.sh
```

### Option 2: Deploy แบบทีละขั้นตอน

```bash
# 1. Schema Only
npm run db:push

# 2. Basic Data (Users + Sample Course)
npm run db:seed

# 3. SCORM Courses (5 คอร์ส)
npx tsx prisma/seed-world-change-courses.ts

# 4. Verify
npx tsx prisma/verify-courses.ts
```

---

## 📊 Database Schema (SCORM Support)

```prisma
model Course {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String
  category        String
  level           String
  duration        Int      // minutes
  price           Float
  
  // SCORM 2004 Fields
  scormPackageUrl String?
  scormVersion    ScormVersion?
  
  modules         Module[]
  lessons         Lesson[]
  enrollments     Enrollment[]
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  content     String?
  order       Int
  duration    Int
  type        LessonType
  
  // SCORM Data
  scormData   Json?    // { version, launchUrl, masteryScore }
  
  moduleId    String
  module      Module   @relation(fields: [moduleId], references: [id])
}

enum ScormVersion {
  SCORM_1_2
  SCORM_2004
}

enum LessonType {
  VIDEO
  INTERACTIVE
  CASE_STUDY
  ASSIGNMENT
  QUIZ
}
```

---

## 🔧 Troubleshooting

### ❌ Error: "Can't reach database server"

```bash
# ตรวจสอบ DATABASE_URL
echo $DATABASE_URL

# ทดสอบการเชื่อมต่อ
npx prisma db pull
```

### ❌ Error: "Seed script failed"

```bash
# ลบข้อมูลเก่าและ Seed ใหม่
npx prisma migrate reset --force
npx prisma db seed
```

### ❌ Error: "SCORM package not found"

```bash
# ตรวจสอบว่ามีโฟลเดอร์ public/scorm/
ls -la public/scorm/

# สร้างโฟลเดอร์ถ้ายังไม่มี
mkdir -p public/scorm
```

---

## 📈 Performance Optimization

### CDN Configuration (Vercel)

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.cloudfront.net'],
  },
  async headers() {
    return [
      {
        source: '/scorm/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ]
  }
}
```

### Database Connection Pooling

```bash
# .env.production
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=100"
```

---

## 🎓 Test Accounts

```bash
# Admin
admin@skillnexus.com / Admin@123!

# Teacher  
teacher@skillnexus.com / Teacher@123!

# Student (with 1000 credits)
joesive47@gmail.com / Student@123!
student@skillnexus.com / Student@123!
```

---

## 📞 Support & Resources

- 📖 **Full Documentation:** [WORLD-CHANGE-COURSES.md](./WORLD-CHANGE-COURSES.md)
- 🚀 **Quick Deploy:** [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)
- ✅ **Checklist:** [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)
- 🗄️ **Database Guide:** [DATABASE-MIGRATION-GUIDE.md](./DATABASE-MIGRATION-GUIDE.md)

---

## ✅ Deployment Checklist

- [ ] Database Created (Vercel/Supabase/Neon)
- [ ] Environment Variables Set
- [ ] Schema Pushed (`npx prisma db push`)
- [ ] Basic Data Seeded (`npx prisma db seed`)
- [ ] SCORM Courses Seeded (`npx tsx prisma/seed-world-change-courses.ts`)
- [ ] Courses Verified (`npx tsx prisma/verify-courses.ts`)
- [ ] SCORM Packages Uploaded to `/public/scorm/`
- [ ] CDN Configured (Optional)
- [ ] Test Accounts Working
- [ ] Production URL Updated

---

**🎉 พร้อม Deploy แล้ว! ไปเปลี่ยนแปลงโลกกันเลย! 🌍🚀**
