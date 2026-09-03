# 🌐 SCORM Hosting URLs

## Netlify Sites

### Site 1: Dynamic Gumption (Original)
**URL:** https://dynamic-gumption-cd5cca.netlify.app/
**Status:** Active
**Courses:** Existing SCORM courses

### Site 2: Silly Faloodeh (New)
**URL:** https://silly-faloodeh-72a70c.netlify.app/
**Status:** Active
**Purpose:** Professional Series (Batch 3) or additional courses

---

## 📦 Professional Series Courses (Batch 3)

### Course 7: Generative AI for Professionals
- **Duration:** 120 minutes
- **Level:** Intermediate-Advanced
- **Folder:** `generative-ai-professionals/`
- **URL:** `https://silly-faloodeh-72a70c.netlify.app/generative-ai-professionals/`

### Course 8: Data-Driven Decision Making & Analytics
- **Duration:** 110 minutes
- **Level:** Intermediate
- **Folder:** `data-driven-decision-making/`
- **URL:** `https://silly-faloodeh-72a70c.netlify.app/data-driven-decision-making/`

### Course 9: Cybersecurity Awareness & Data Governance
- **Duration:** 100 minutes
- **Level:** Beginner-Intermediate
- **Folder:** `cybersecurity-data-governance/`
- **URL:** `https://silly-faloodeh-72a70c.netlify.app/cybersecurity-data-governance/`

---

## 🚀 Upload Instructions

### Step 1: Prepare SCORM Folders
Each course needs these files:
```
course-folder/
├── imsmanifest.xml
├── index.html
├── module1.html
├── module2.html
├── module3.html
├── module4.html
├── quiz.html
├── css/
│   └── styles.css
├── js/
│   └── scorm-api.js
└── assets/
    └── images/
```

### Step 2: Upload to Netlify
1. Go to: https://app.netlify.com/
2. Select site: **silly-faloodeh-72a70c**
3. Drag & drop the **extracted folder** (not ZIP)
4. Wait for deployment
5. Test URL: `https://silly-faloodeh-72a70c.netlify.app/[folder-name]/`

### Step 3: Update Database
Run SQL to add courses to your LMS:
```sql
-- See SCORM-PROFESSIONAL-SERIES-SQL.md for full SQL scripts
```

---

## ✅ Verification Checklist

- [ ] SCORM folder uploaded to Netlify
- [ ] URL accessible: `https://silly-faloodeh-72a70c.netlify.app/[course]/`
- [ ] `imsmanifest.xml` loads correctly
- [ ] Course launches in LMS
- [ ] SCORM tracking works
- [ ] Quiz scores recorded

---

## 📝 Notes

- **Upload Format:** Extracted FOLDERS, not ZIP files
- **URL Pattern:** `https://[site-name].netlify.app/[course-folder]/`
- **Launch File:** Usually `index.html` or specified in `imsmanifest.xml`
- **Testing:** Always test in LMS before publishing to students
