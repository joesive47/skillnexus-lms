# 🚀 Deploy to Vercel - One Command Setup

## ⚡ Quick Deploy (5 นาที)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "🌍 Add 5 SCORM 2004 World-Changing Courses"
git push origin main
```

### Step 2: Deploy on Vercel

1. ไปที่ https://vercel.com/new
2. Import repository: `The-SkillNexus`
3. Add Environment Variables:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"
```

**Generate Secret:**
```bash
openssl rand -base64 32
```

### Step 3: Setup Database (Choose One)

#### Option A: Vercel Postgres (แนะนำ)
```bash
# 1. Go to Vercel Dashboard > Storage > Create Database
# 2. Select "Postgres"
# 3. Copy DATABASE_URL automatically
```

#### Option B: Supabase (Free Tier)
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database > Connection String
# 4. Copy "Connection pooling" URL
```

#### Option C: Neon (Serverless)
```bash
# 1. Go to https://neon.tech
# 2. Create new project
# 3. Copy connection string
```

### Step 4: Run Deployment Script

```bash
# After Vercel deployment, run this in Vercel CLI or locally:

# 1. Pull environment variables
vercel env pull .env.production.local

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Deploy all data (Users + 5 SCORM Courses)
npx tsx prisma/deploy-all.ts
```

---

## 🎯 One-Line Deploy (After Vercel Setup)

```bash
npx prisma generate && npx prisma db push && npx tsx prisma/deploy-all.ts
```

---

## ✅ What Gets Deployed

### 👥 Users (3)
- ✅ Admin: `admin@skillnexus.com` / `Admin@123!`
- ✅ Teacher: `teacher@skillnexus.com` / `Teacher@123!`
- ✅ Student: `joesive47@gmail.com` / `Student@123!` (10,000 credits)

### 🌍 SCORM 2004 Courses (5)

| # | Course | Duration | Modules | Lessons | Price |
|---|--------|----------|---------|---------|-------|
| 1 | 🎯 SDGs Leadership | 8h | 4 | 12 | ฿4,999 |
| 2 | ♻️ Circular Economy | 6h | 4 | 12 | ฿3,999 |
| 3 | 💡 Social Entrepreneurship | 7h | 4 | 12 | ฿4,499 |
| 4 | ⚡ Renewable Energy | 6.5h | 4 | 12 | ฿3,799 |
| 5 | 🌱 Regenerative Agriculture | 6.3h | 4 | 12 | ฿3,599 |

**Total:** 33.8 hours | 20 modules | 60 SCORM lessons | ฿20,796

---

## 🔧 Verify Deployment

```bash
# Check if courses were created
npx tsx prisma/verify-courses.ts

# Expected output:
# ✅ Found 5 courses:
# 1. Sustainable Development Goals (SDGs) Leadership
# 2. Circular Economy & Zero Waste Innovation
# 3. Social Entrepreneurship & Impact Investing
# 4. Renewable Energy & Clean Technology
# 5. Regenerative Agriculture & Food Systems
```

---

## 📦 SCORM Package Structure

หลัง Deploy แล้ว คุณสามารถแก้ไข SCORM content ได้ที่:

```
public/scorm/
├── sdgs-leadership-2030/
│   ├── index.html
│   ├── module-1/
│   │   ├── lesson-1/index.html
│   │   ├── lesson-2/index.html
│   │   └── lesson-3/index.html
│   ├── module-2/
│   ├── module-3/
│   └── module-4/
│
├── circular-economy-zero-waste/
├── social-entrepreneurship-impact/
├── renewable-energy-cleantech/
└── regenerative-agriculture-food/
```

---

## 🎨 Customize Later

### แก้ไขเนื้อหาหลักสูตร

```bash
# 1. Go to Prisma Studio
npx prisma studio

# 2. Edit Course table:
#    - title, description, price
#    - thumbnail, category, level

# 3. Edit Module table:
#    - title, description, duration

# 4. Edit Lesson table:
#    - title, content, type
#    - scormData (launchUrl, masteryScore)
```

### อัพโหลด SCORM Packages

```bash
# 1. สร้าง SCORM package (ZIP)
# 2. อัพโหลดไปยัง public/scorm/
# 3. แตก ZIP และอัพเดท launchUrl ใน Lesson
```

---

## 🌐 Access Your LMS

```
Production URL: https://your-app.vercel.app

Pages:
├── /                          # Landing page
├── /login                     # Login
├── /dashboard                 # Student dashboard
├── /dashboard/courses         # Browse courses
├── /dashboard/admin           # Admin panel
└── /skills-assessment         # Skill assessment
```

---

## 🔑 Login & Test

```bash
# 1. Go to: https://your-app.vercel.app/login

# 2. Login as Student:
Email: joesive47@gmail.com
Password: Student@123!

# 3. Browse courses:
https://your-app.vercel.app/dashboard/courses

# 4. Enroll in SCORM course and start learning!
```

---

## 📊 Database Schema

```prisma
model Course {
  scormPackageUrl String?
  scormVersion    ScormVersion?  // SCORM_2004
}

model Lesson {
  scormData Json?
  // {
  //   version: "SCORM_2004",
  //   launchUrl: "/scorm/course-slug/module-1/lesson-1/index.html",
  //   masteryScore: 80,
  //   completionThreshold: 100
  // }
}
```

---

## 🚨 Troubleshooting

### ❌ "Can't reach database server"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### ❌ "Prisma Client not generated"
```bash
npx prisma generate
```

### ❌ "Module not found"
```bash
npm install
npx prisma generate
```

---

## 📈 Next Steps

1. ✅ **Customize Content** - แก้ไขเนื้อหาหลักสูตรใน Prisma Studio
2. ✅ **Upload SCORM** - อัพโหลด SCORM packages จริง
3. ✅ **Add Videos** - เพิ่มวิดีโอเนื้อหา
4. ✅ **Setup CDN** - ใช้ Cloudflare/CloudFront สำหรับ SCORM files
5. ✅ **Marketing** - สร้าง Landing page และโปรโมท

---

## 🎉 Success!

คุณได้ Deploy LMS พร้อม 5 หลักสูตร SCORM 2004 แล้ว! 🚀

**Total Value:** ฿20,796  
**Total Content:** 33.8 hours  
**Total Lessons:** 60 SCORM 2004 lessons  

พร้อมเปลี่ยนแปลงโลกแล้ว! 🌍✨
