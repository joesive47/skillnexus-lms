# SkillNexus LMS - Seed User Credentials

This document contains all the seeded user accounts for testing the SkillNexus LMS platform.

## 🔐 Password Format

All passwords follow the standardized format: `[role]@123!`

Examples:
- Admin password: `admin@123!`
- Teacher password: `teacher@123!`
- Student password: `student@123!`

---

## 👑 ADMIN ACCOUNTS
**Password:** `admin@123!`

| Email | Name | Credits |
|-------|------|---------|
| admin@skillnexus.com | นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin) | 10,000 |
| admin@bizsolve-ai.com | ผู้ดูแลระบบ BizSolve AI | 10,000 |
| admin@example.com | System Administrator | 10,000 |

---

## 👨‍🏫 TEACHER ACCOUNTS
**Password:** `teacher@123!`

| Email | Name | Credits |
|-------|------|---------|
| teacher@skillnexus.com | นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin) | 5,000 |
| teacher@example.com | Prof. Sarah Johnson | 5,000 |
| instructor@skillnexus.com | Dr. Michael Chen | 5,000 |
| tutor@skillnexus.com | Emily Rodriguez | 5,000 |

---

## 👨‍🎓 STUDENT ACCOUNTS
**Password:** `student@123!`

| Email | Name | Credits |
|-------|------|---------|
| student@skillnexus.com | นักเรียนตัวอย่าง | 1,000 |
| student@example.com | Alex Thompson | 800 |
| john@example.com | John Doe | 500 |
| alice@example.com | Alice Johnson | 750 |
| joesive47@gmail.com | Joe Sive | 1,000 |
| bob@example.com | Bob Smith | 300 |
| emma@example.com | Emma Wilson | 1,200 |
| david@example.com | David Brown | 800 |
| sarah@example.com | Sarah Davis | 600 |
| mike@example.com | Mike Miller | 900 |
| lisa@example.com | Lisa Garcia | 400 |

---

## 🏢 ENTERPRISE ACCOUNTS
**Password:** `enterprise@123!`

| Email | Name | Credits |
|-------|------|---------|
| enterprise@skillnexus.com | Enterprise Admin | 50,000 |
| corporate@example.com | Corporate Training Manager | 50,000 |
| business@skillnexus.com | Business Account Manager | 50,000 |

---

## 🛡️ MODERATOR ACCOUNTS
**Password:** `moderator@123!`

| Email | Name | Credits |
|-------|------|---------|
| moderator@skillnexus.com | Content Moderator | 3,000 |
| mod@example.com | Community Manager | 3,000 |

---

## 🎨 CONTENT CREATOR ACCOUNTS
**Password:** `creator@123!`

| Email | Name | Credits |
|-------|------|---------|
| creator@skillnexus.com | Content Creator | 2,000 |
| author@example.com | Course Author | 2,000 |

---

## 🔗 Quick Links

- **Login Page:** http://localhost:3001/login
- **Skills Assessment:** http://localhost:3001/skills-assessment
- **Import Questions:** http://localhost:3001/skills-assessment/import

---

## 📝 How to Seed the Database

1. **Start Docker Desktop** (if not already running)

2. **Start the database:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Push the Prisma schema:**
   ```bash
   npx prisma db push
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Run the seed script:**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📊 Role Summary

| Role | Count | Default Credits | Password Pattern |
|------|-------|----------------|------------------|
| ADMIN | 3 | 10,000 | `admin@123!` |
| TEACHER | 4 | 5,000 | `teacher@123!` |
| STUDENT | 11 | 300-1,200 | `student@123!` |
| ENTERPRISE | 3 | 50,000 | `enterprise@123!` |
| MODERATOR | 2 | 3,000 | `moderator@123!` |
| CONTENT_CREATOR | 2 | 2,000 | `creator@123!` |
| **TOTAL** | **25** | - | - |

---

*Last Updated: 2026-02-03*
