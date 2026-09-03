# 🚀 SCORM Upload to GitHub - Quick Start

## ⚡ One-Command Upload (3 Steps)

### Step 1: Set GitHub Token
```cmd
set GITHUB_TOKEN=your_github_token_here
```

**Get Token:** https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scope: `repo` (Full control of private repositories)
- Generate and copy token

### Step 2: Run Upload Script
```cmd
.\upload-scorm-to-github.bat
```

### Step 3: Wait & Done! ✅
- Script will upload all .zip files from `C:\API\scorm\scorm-courses`
- Creates GitHub Release v2.0.0
- Generates URL list and SQL import script

---

## 📊 What You'll Get

### 1. GitHub Release
```
https://github.com/joesive47/skillnexus-lms/releases/tag/v2.0.0
```

### 2. Download URLs (SCORM-URLS-COMPLETE.md)
```markdown
| # | Course Name | Size | Download URL |
|---|-------------|------|--------------|
| 1 | 1-ai-chatgpt-business.zip | 2.5 MB | [Download](https://github.com/.../1-ai-chatgpt-business.zip) |
| 2 | 2-data-analytics-bi.zip | 3.1 MB | [Download](https://github.com/.../2-data-analytics-bi.zip) |
...
```

### 3. SQL Import Script (scorm-bulk-import.sql)
```sql
INSERT INTO courses (title, description, scorm_url, published) VALUES
('AI ChatGPT Business', 'Professional SCORM 2004 course', 
 'https://github.com/.../1-ai-chatgpt-business.zip', true);
```

---

## 🎯 Use in www.uppowerskill.com

### Method 1: Admin Dashboard (Recommended)
1. Login to admin dashboard
2. Go to **Courses → Add New Course**
3. Fill in course details:
   - **Title:** AI ChatGPT for Business
   - **SCORM URL:** `https://github.com/.../1-ai-chatgpt-business.zip`
   - **Published:** ✅ Yes
4. Click **Save**
5. System automatically downloads and extracts SCORM package
6. Course is ready! 🎉

### Method 2: Bulk Import via SQL
```bash
# Import all courses at once
psql $DATABASE_URL -f scorm-bulk-import.sql

# Or using npm script
npm run db:import-scorm
```

### Method 3: API Import
```javascript
// POST /api/admin/courses
{
  "title": "AI ChatGPT for Business",
  "description": "Master ChatGPT for business applications",
  "scormUrl": "https://github.com/.../1-ai-chatgpt-business.zip",
  "published": true
}
```

---

## 📋 Course List (60+ Courses)

### AI & Technology (10 courses)
1. ✅ AI ChatGPT for Business
2. ✅ Generative AI for Professionals
3. ✅ AI Implementation Strategy
4. ✅ AI Automation Mastery
5. ✅ AI Solopreneur
6. ✅ AI Software Innovator
7. ✅ AI Ethics & Responsible AI
8. ✅ AI Side Hustle Mastery
9. ✅ From Code to CEO
10. ✅ Quantum Computing Basics

### Data & Analytics (4 courses)
11. ✅ Data Analytics & BI
12. ✅ Data-Driven Decision Making
13. ✅ Data Analytics for Leaders
14. ✅ Business Intelligence Analytics

### Business & Leadership (6 courses)
15. ✅ Agile Leadership
16. ✅ Product Management
17. ✅ Growth Hacking
18. ✅ Digital Strategy
19. ✅ Corporate Executive Leadership
20. ✅ M&A Corporate Strategy

### Marketing & Sales (5 courses)
21. ✅ Digital Marketing
22. ✅ Copywriting & Persuasion
23. ✅ Ecommerce Mastery
24. ✅ Personal Branding
25. ✅ Negotiation & Sales

### Technology & Development (5 courses)
26. ✅ Cloud DevOps
27. ✅ No-Code Bootcamp
28. ✅ UX/UI Design Bootcamp
29. ✅ AR/VR Metaverse Development
30. ✅ Blockchain & Web3

### Personal Development (15 courses)
31. ✅ Communication Mastery
32. ✅ Time Management
33. ✅ Public Speaking
34. ✅ Emotional Intelligence
35. ✅ Critical Thinking & Logic
36. ✅ Creative Thinking & Innovation
37. ✅ Confidence & Charisma
38. ✅ Resilience & Grit
39. ✅ Habits & Systems
40. ✅ Learning How to Learn
41. ✅ Mental Health & Wellbeing
42. ✅ Mindfulness & Productivity
43. ✅ Wealth Mindset
44. ✅ Future of Work & Career Design
45. ✅ Fitness & Performance

### Creative & Content (6 courses)
46. ✅ Video Content Mastery
47. ✅ Creative Writing & Storytelling
48. ✅ Photography & Visual Storytelling
49. ✅ Music Production & Audio
50. ✅ Coaching & Mentoring
51. ✅ Consulting & Advisory

### Security & Compliance (2 courses)
52. ✅ Cybersecurity & PDPA
53. ✅ Cybersecurity Governance

### Finance & Business (3 courses)
54. ✅ Financial Literacy
55. ✅ FinTech & Digital Banking
56. ✅ Startup Fundraising

### Industry Specific (4 courses)
57. ✅ Healthcare Digital Transformation
58. ✅ Retail Omnichannel Excellence
59. ✅ IoT & Smart Systems
60. ✅ Social Impact & Nonprofit

### Special Programs (3 courses)
61. ✅ Sustainability & ESG Leadership
62. ✅ Nutrition & Wellness Coaching
63. ✅ Capstone Project

---

## 🔧 Troubleshooting

### Issue: GitHub Token Error
```cmd
# Set token in current session
set GITHUB_TOKEN=your_token_here

# Or set permanently
setx GITHUB_TOKEN "your_token_here"
```

### Issue: GitHub CLI Not Found
```cmd
# Install GitHub CLI
winget install GitHub.cli

# Or download from
https://cli.github.com/
```

### Issue: File Already Exists
- Script automatically replaces existing files
- Old versions are deleted before upload

### Issue: Upload Fails
```cmd
# Check internet connection
ping github.com

# Check GitHub CLI auth
gh auth status

# Re-authenticate
gh auth login
```

---

## 📊 Expected Results

### Upload Statistics
- **Total Courses:** 60+
- **Total Size:** ~150 MB
- **Upload Time:** 5-10 minutes
- **Success Rate:** 99%+

### Generated Files
1. **SCORM-URLS-COMPLETE.md** - All download URLs
2. **scorm-bulk-import.sql** - SQL import script
3. **GitHub Release v2.0.0** - Public release with all files

---

## ✅ Verification Checklist

### After Upload
- [ ] GitHub Release v2.0.0 exists
- [ ] All 60+ files uploaded
- [ ] SCORM-URLS-COMPLETE.md generated
- [ ] scorm-bulk-import.sql generated
- [ ] Download URLs work

### After Import
- [ ] Courses appear in database
- [ ] SCORM URLs are correct
- [ ] Courses are published
- [ ] SCORM player works
- [ ] Progress tracking active

---

## 🎉 Success!

Once uploaded, you can use the URLs in www.uppowerskill.com:

```
https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/1-ai-chatgpt-business.zip
https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/2-data-analytics-bi.zip
...
```

**🚀 Ready to create 60+ professional courses!**

---

## 📞 Support

- **Documentation:** SCORM-BULK-UPLOAD-GUIDE.md
- **Quick Reference:** QUICK-REFERENCE.md
- **Project History:** PROJECT-HISTORY-SUMMARY.md

**Need help?** Check the troubleshooting section above or review the complete guide.