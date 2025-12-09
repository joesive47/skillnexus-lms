# 🗄️ Database Migration Guide - Skill Assessment Update

## 📋 ภาพรวม

คู่มือนี้จะแนะนำวิธีการอัปเดต Database Schema สำหรับระบบ Skill Assessment ที่ปรับปรุงใหม่

---

## 🔍 การเปลี่ยนแปลง Schema

### 1. AssessmentQuestion Model

**ฟิลด์ใหม่ที่เพิ่ม:**

```prisma
model AssessmentQuestion {
  // ... existing fields ...
  
  // Enhanced fields for analysis
  skillCategory      String?     @default("General")
  skillImportance    String?     @default("Medium")
  questionType       String?     @default("single")
  difficultyLevel    String?     @default("Intermediate")
  explanation        String?
  courseTitle        String?
  learningResource   String?
  estimatedTime      Int?
  prerequisiteSkills String?
  
  // ... relations ...
}
```

### 2. AssessmentResult Model

**ฟิลด์ใหม่ที่เพิ่ม:**

```prisma
model AssessmentResult {
  // ... existing fields ...
  
  // Enhanced analysis field
  analysis    String?  @db.Text
  
  // ... relations ...
}
```

---

## 🚀 วิธีการ Migrate

### Option 1: Development (แนะนำ)

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema changes to database
npx prisma db push

# 3. Verify changes
npx prisma studio
```

### Option 2: Production (ใช้ Migrations)

```bash
# 1. Create migration
npx prisma migrate dev --name add_assessment_analysis_fields

# 2. Review migration file
# Check: prisma/migrations/[timestamp]_add_assessment_analysis_fields/migration.sql

# 3. Apply migration
npx prisma migrate deploy

# 4. Generate Prisma Client
npx prisma generate
```

### Option 3: Manual SQL (สำหรับ Production ที่มีข้อมูลเยอะ)

```sql
-- Add columns to assessment_questions table
ALTER TABLE assessment_questions 
ADD COLUMN skill_category VARCHAR(255) DEFAULT 'General',
ADD COLUMN skill_importance VARCHAR(255) DEFAULT 'Medium',
ADD COLUMN question_type VARCHAR(255) DEFAULT 'single',
ADD COLUMN difficulty_level VARCHAR(255) DEFAULT 'Intermediate',
ADD COLUMN explanation TEXT,
ADD COLUMN course_title VARCHAR(255),
ADD COLUMN learning_resource VARCHAR(255),
ADD COLUMN estimated_time INTEGER,
ADD COLUMN prerequisite_skills TEXT;

-- Add column to assessment_results table
ALTER TABLE assessment_results 
ADD COLUMN analysis TEXT;

-- Create indexes for better performance
CREATE INDEX idx_assessment_questions_skill_category ON assessment_questions(skill_category);
CREATE INDEX idx_assessment_questions_difficulty_level ON assessment_questions(difficulty_level);
CREATE INDEX idx_assessment_questions_skill_importance ON assessment_questions(skill_importance);
```

---

## 🔄 Data Migration (ข้อมูลเดิม)

### 1. Update Existing Questions

```sql
-- Set default values for existing questions
UPDATE assessment_questions 
SET 
  skill_category = 'Technical',
  skill_importance = 'High',
  question_type = 'single',
  difficulty_level = 'Intermediate'
WHERE skill_category IS NULL;
```

### 2. Migrate Course Links

```sql
-- Update course links to new format
UPDATE assessment_questions 
SET 
  course_title = CONCAT('Course for ', skill_name),
  learning_resource = 'Internal LMS'
WHERE course_link IS NOT NULL 
  AND course_title IS NULL;
```

### 3. Estimate Learning Time

```sql
-- Set estimated time based on difficulty
UPDATE assessment_questions 
SET estimated_time = CASE 
  WHEN difficulty_level = 'Beginner' THEN 20
  WHEN difficulty_level = 'Intermediate' THEN 40
  WHEN difficulty_level = 'Advanced' THEN 60
  ELSE 30
END
WHERE estimated_time IS NULL;
```

---

## ✅ Verification Steps

### 1. Check Schema

```bash
# Open Prisma Studio
npx prisma studio

# Verify:
# - assessment_questions table has new columns
# - assessment_results table has analysis column
# - All columns have correct types
```

### 2. Test Import

```bash
# 1. Go to /skills-assessment/import
# 2. Download template
# 3. Fill with sample data (including new columns)
# 4. Import and verify
```

### 3. Test Assessment

```bash
# 1. Take an assessment
# 2. Check results page
# 3. Verify analysis tab shows data
# 4. Check database for analysis JSON
```

### 4. Run Tests

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Check for errors
npm run lint
```

---

## 🔧 Rollback Plan

### If Something Goes Wrong

**Option 1: Rollback Migration**

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back [migration_name]

# Apply previous migration
npx prisma migrate deploy
```

**Option 2: Manual Rollback**

```sql
-- Remove new columns from assessment_questions
ALTER TABLE assessment_questions 
DROP COLUMN skill_category,
DROP COLUMN skill_importance,
DROP COLUMN question_type,
DROP COLUMN difficulty_level,
DROP COLUMN explanation,
DROP COLUMN course_title,
DROP COLUMN learning_resource,
DROP COLUMN estimated_time,
DROP COLUMN prerequisite_skills;

-- Remove new column from assessment_results
ALTER TABLE assessment_results 
DROP COLUMN analysis;

-- Drop indexes
DROP INDEX IF EXISTS idx_assessment_questions_skill_category;
DROP INDEX IF EXISTS idx_assessment_questions_difficulty_level;
DROP INDEX IF EXISTS idx_assessment_questions_skill_importance;
```

**Option 3: Restore from Backup**

```bash
# Restore database from backup
# (Make sure you have a backup before migration!)

# For PostgreSQL
pg_restore -d skillnexus backup_file.dump

# For MySQL
mysql skillnexus < backup_file.sql

# For SQLite
cp backup.db dev.db
```

---

## 📊 Performance Considerations

### 1. Index Creation

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_assessment_questions_career_skill 
ON assessment_questions(career_id, skill_id);

CREATE INDEX idx_assessment_results_user_career 
ON assessment_results(user_id, career_id);

CREATE INDEX idx_assessment_results_completed_at 
ON assessment_results(completed_at DESC);
```

### 2. Query Optimization

```typescript
// Use select to fetch only needed fields
const questions = await prisma.assessmentQuestion.findMany({
  where: { careerId },
  select: {
    id: true,
    questionText: true,
    skillCategory: true,
    difficultyLevel: true,
    // ... only needed fields
  }
})
```

### 3. Batch Operations

```typescript
// Use transactions for batch updates
await prisma.$transaction(
  questions.map(q => 
    prisma.assessmentQuestion.update({
      where: { id: q.id },
      data: { /* updates */ }
    })
  )
)
```

---

## 🔒 Security Considerations

### 1. Backup Before Migration

```bash
# PostgreSQL
pg_dump skillnexus > backup_$(date +%Y%m%d_%H%M%S).sql

# MySQL
mysqldump skillnexus > backup_$(date +%Y%m%d_%H%M%S).sql

# SQLite
cp dev.db backup_$(date +%Y%m%d_%H%M%S).db
```

### 2. Test in Staging First

```bash
# 1. Clone production database to staging
# 2. Run migration on staging
# 3. Test thoroughly
# 4. If successful, run on production
```

### 3. Monitor After Migration

```bash
# Check for errors
tail -f logs/application.log

# Monitor database performance
# Use database monitoring tools

# Check API response times
# Use APM tools (New Relic, DataDog, etc.)
```

---

## 📝 Migration Checklist

### Pre-Migration

- [ ] Backup database
- [ ] Test migration on staging
- [ ] Review migration SQL
- [ ] Notify users (if downtime required)
- [ ] Prepare rollback plan

### During Migration

- [ ] Stop application (if required)
- [ ] Run migration commands
- [ ] Verify schema changes
- [ ] Run data migration scripts
- [ ] Test basic functionality

### Post-Migration

- [ ] Start application
- [ ] Run verification tests
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Test all features
- [ ] Update documentation

---

## 🐛 Common Issues & Solutions

### Issue 1: Migration Fails

**Error:**
```
Error: Migration failed to apply
```

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Resolve failed migration
npx prisma migrate resolve --rolled-back [migration_name]

# Try again
npx prisma migrate deploy
```

### Issue 2: Column Already Exists

**Error:**
```
Error: column "skill_category" already exists
```

**Solution:**
```sql
-- Check if column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'assessment_questions';

-- If exists, skip or modify migration
```

### Issue 3: Data Type Mismatch

**Error:**
```
Error: column "estimated_time" cannot be cast to integer
```

**Solution:**
```sql
-- Convert data type
ALTER TABLE assessment_questions 
ALTER COLUMN estimated_time TYPE INTEGER 
USING estimated_time::integer;
```

### Issue 4: Foreign Key Constraint

**Error:**
```
Error: foreign key constraint fails
```

**Solution:**
```sql
-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Run migration

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
```

---

## 📞 Support

หากพบปัญหาในการ migrate:

1. **Check Logs:**
   ```bash
   tail -f logs/prisma.log
   ```

2. **Prisma Documentation:**
   https://www.prisma.io/docs/concepts/components/prisma-migrate

3. **Community Support:**
   - Discord: SkillNexus Community
   - GitHub Issues
   - Stack Overflow

4. **Professional Support:**
   - Email: support@skillnexus.com
   - Emergency: +66-xxx-xxx-xxxx

---

## 🎯 Best Practices

1. **Always Backup** - ก่อน migrate ทุกครั้ง
2. **Test First** - ทดสอบใน staging ก่อน production
3. **Use Migrations** - ใช้ Prisma migrations แทน manual SQL
4. **Version Control** - เก็บ migration files ใน Git
5. **Document Changes** - บันทึกการเปลี่ยนแปลงทุกครั้ง
6. **Monitor Performance** - ติดตามประสิทธิภาพหลัง migrate
7. **Plan Rollback** - เตรียมแผน rollback ไว้เสมอ

---

**Last Updated:** January 24, 2025  
**Version:** 2.0.0  
**Author:** SkillNexus Development Team
