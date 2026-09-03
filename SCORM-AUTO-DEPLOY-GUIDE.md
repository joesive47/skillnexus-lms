# 🚀 SCORM Auto Deploy - Quick Start Guide

## ⚡ วิธีใช้งาน (1 คำสั่งเดียว!)

### Windows:
```bash
deploy-scorm.bat
```

### Mac/Linux:
```bash
chmod +x scripts/deploy-scorm.js
node scripts/deploy-scorm.js
```

---

## 📋 สิ่งที่สคริปต์จะทำอัตโนมัติ

### ✅ Step 1: ตรวจสอบ Prerequisites
- Git installed
- GitHub CLI installed
- GitHub authentication

### ✅ Step 2: ตรวจสอบ Repository
- Auto-detect GitHub repo
- Verify remote connection

### ✅ Step 3: หา SCORM Packages
- Scan `public/scorm-packages/`
- List all .zip files
- Show file sizes

### ✅ Step 4: สร้าง GitHub Release
- Create release `v1.0.0`
- Upload all .zip files
- Generate release notes

### ✅ Step 5: สร้าง Download URLs
- Generate direct download links
- Format: `https://github.com/[user]/[repo]/releases/download/v1.0.0/[file].zip`

### ✅ Step 6: สร้าง SQL Script
- Auto-generate `update-scorm-urls.sql`
- UPDATE existing courses
- INSERT new courses

### ✅ Step 7: Update Database (Optional)
- Execute SQL automatically
- Or provide manual instructions

### ✅ Step 8: สร้าง Summary Report
- Generate `SCORM-DEPLOYMENT-SUMMARY.md`
- Include all URLs
- Testing instructions

---

## 🎯 ผลลัพธ์ที่ได้

### 1. GitHub Release
```
https://github.com/[user]/The-SkillNexus/releases/tag/v1.0.0
```

### 2. Download URLs
```
https://github.com/[user]/The-SkillNexus/releases/download/v1.0.0/prompt-engineering-scorm.zip
https://github.com/[user]/The-SkillNexus/releases/download/v1.0.0/scorm-test.zip
...
```

### 3. SQL Script (`update-scorm-urls.sql`)
```sql
-- Update existing courses
UPDATE "Course"
SET "scormUrl" = 'https://github.com/.../prompt-engineering-scorm.zip',
    "scormVersion" = '2004',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "title" ILIKE '%Prompt%'
  AND "scormUrl" IS NULL;

-- Insert new courses
INSERT INTO "Course" (...)
VALUES (...);
```

### 4. Summary Report (`SCORM-DEPLOYMENT-SUMMARY.md`)
- Deployment details
- All URLs
- Testing commands
- Next steps

---

## 🔧 Requirements

### ต้องติดตั้งก่อน:

**1. Node.js**
```bash
# Check
node --version

# Install (Windows)
winget install OpenJS.NodeJS

# Install (Mac)
brew install node
```

**2. Git**
```bash
# Check
git --version

# Install (Windows)
winget install Git.Git

# Install (Mac)
brew install git
```

**3. GitHub CLI**
```bash
# Check
gh --version

# Install (Windows)
winget install GitHub.cli

# Install (Mac)
brew install gh
```

**4. GitHub Authentication**
```bash
# Login
gh auth login

# Follow prompts:
# - GitHub.com
# - HTTPS
# - Login with browser
```

---

## 📝 ขั้นตอนการใช้งาน

### 1. เตรียมไฟล์ SCORM
```bash
# ตรวจสอบว่ามีไฟล์ .zip ใน public/scorm-packages/
dir public\scorm-packages\*.zip
```

### 2. Run Script
```bash
# Windows
deploy-scorm.bat

# Mac/Linux
node scripts/deploy-scorm.js
```

### 3. ตรวจสอบผลลัพธ์
```bash
# ดู Release บน GitHub
gh release view v1.0.0

# ดู SQL script
type update-scorm-urls.sql

# ดู Summary
type SCORM-DEPLOYMENT-SUMMARY.md
```

### 4. Update Database (ถ้าต้องการ)
```bash
# Option 1: Auto (ถ้า DATABASE_URL มี)
# Script จะทำให้อัตโนมัติ

# Option 2: Manual
psql $DATABASE_URL -f update-scorm-urls.sql

# Option 3: Prisma Studio
npx prisma studio
# Copy-paste SQL manually
```

### 5. Test Download
```bash
# Test URL
curl -I "https://github.com/[user]/[repo]/releases/download/v1.0.0/prompt-engineering-scorm.zip"

# Download file
curl -L "https://github.com/[user]/[repo]/releases/download/v1.0.0/prompt-engineering-scorm.zip" -o test.zip
```

---

## 🐛 Troubleshooting

### ❌ "GitHub CLI not installed"
```bash
# Windows
winget install GitHub.cli

# Mac
brew install gh

# Linux
sudo apt install gh
```

### ❌ "Not authenticated"
```bash
gh auth login
# Follow browser login
```

### ❌ "No .zip files found"
```bash
# Check directory
dir public\scorm-packages\

# Make sure files end with .zip
```

### ❌ "Release already exists"
```bash
# Delete old release
gh release delete v1.0.0 -y

# Run script again
deploy-scorm.bat
```

### ❌ "Database update failed"
```bash
# Update manually
psql $DATABASE_URL -f update-scorm-urls.sql

# Or use Prisma Studio
npx prisma studio
```

---

## 🎨 Customization

### เปลี่ยน Release Version
Edit `scripts/deploy-scorm.js`:
```javascript
const CONFIG = {
  RELEASE_VERSION: 'v2.0.0',  // Change here
  RELEASE_TITLE: 'SCORM Packages v2.0',
  // ...
};
```

### เพิ่ม Course Mapping
Edit `scripts/deploy-scorm.js`:
```javascript
const courseMapping = {
  'prompt-engineering-scorm.zip': 'Prompt Engineering Mastery',
  'your-new-course.zip': 'Your New Course Title',  // Add here
};
```

---

## 📊 Example Output

```
🚀 SCORM Auto Upload & Deploy Script
=====================================

📋 Step 1: Checking prerequisites...
✅ Git installed
✅ GitHub CLI installed
✅ GitHub CLI authenticated

📦 Step 2: Getting repository info...
Repository: https://github.com/yourusername/The-SkillNexus.git
✅ Detected repo: yourusername/The-SkillNexus

🔍 Step 3: Finding SCORM packages...
✅ Found 4 SCORM package(s):
   1. prompt-engineering-scorm.zip (2.45 MB)
   2. scorm-test.zip (1.23 MB)
   3. scorm-sample-demo.zip (3.12 MB)
   4. scorm-working-demo.zip (2.87 MB)

🚀 Step 4: Creating GitHub Release...
Creating release v1.0.0...
✅ Release created successfully!

🔗 Step 5: Getting download URLs...
prompt-engineering-scorm.zip:
  https://github.com/yourusername/The-SkillNexus/releases/download/v1.0.0/prompt-engineering-scorm.zip
...

📝 Step 6: Generating SQL update script...
✅ SQL script saved: update-scorm-urls.sql

💾 Step 7: Updating database...
✅ Database updated successfully!

📊 Step 8: Generating summary...
✅ Summary saved: SCORM-DEPLOYMENT-SUMMARY.md

✅ ========================================
✅ SCORM DEPLOYMENT COMPLETED!
✅ ========================================

📄 Files generated:
   - update-scorm-urls.sql (SQL script)
   - SCORM-DEPLOYMENT-SUMMARY.md (Summary)

🔗 Access your SCORM packages at:
   https://github.com/yourusername/The-SkillNexus/releases/tag/v1.0.0
```

---

## ✅ Success Checklist

- [ ] Prerequisites installed (Node, Git, GitHub CLI)
- [ ] GitHub authenticated
- [ ] SCORM .zip files in `public/scorm-packages/`
- [ ] Run `deploy-scorm.bat`
- [ ] GitHub Release created
- [ ] Download URLs generated
- [ ] SQL script created
- [ ] Database updated
- [ ] Test download URLs
- [ ] Verify courses in LMS

---

## 🎉 Done!

**คุณสามารถใช้ URL เหล่านี้ใน Course ได้เลย:**

```typescript
// Example: Create course with SCORM URL
const course = await prisma.course.create({
  data: {
    title: 'Prompt Engineering Mastery',
    scormUrl: 'https://github.com/[user]/The-SkillNexus/releases/download/v1.0.0/prompt-engineering-scorm.zip',
    scormVersion: '2004',
    // ...
  }
});
```

**หรือใช้ SQL script ที่สร้างให้:**
```bash
psql $DATABASE_URL -f update-scorm-urls.sql
```

---

**🚀 เริ่มได้เลย! แค่รัน `deploy-scorm.bat`**

*Last Updated: January 2025*
