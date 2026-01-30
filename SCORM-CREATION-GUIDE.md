# 🎓 SCORM Package Creation Guide - Professional Series

## 📦 3 หลักสูตรที่จะสร้าง

1. **Generative AI for Professionals** (120 นาที)
2. **Data-Driven Decision Making & Analytics** (110 นาที)
3. **Cybersecurity Awareness & Data Governance** (100 นาที)

---

## 🚀 Quick Start - สร้าง SCORM ใน 3 ขั้นตอน

### ขั้นตอนที่ 1: เตรียมโครงสร้างไฟล์

```bash
# สร้างโฟลเดอร์สำหรับแต่ละหลักสูตร
mkdir scorm-packages
cd scorm-packages

# หลักสูตรที่ 1
mkdir generative-ai-professionals
cd generative-ai-professionals
mkdir assets css js

# หลักสูตรที่ 2
cd ..
mkdir data-driven-decision-making
cd data-driven-decision-making
mkdir assets css js

# หลักสูตรที่ 3
cd ..
mkdir cybersecurity-data-governance
cd cybersecurity-data-governance
mkdir assets css js
```

### ขั้นตอนที่ 2: สร้างไฟล์หลัก

แต่ละหลักสูตรต้องมี:
- `imsmanifest.xml` - SCORM metadata
- `index.html` - หน้าแรกของหลักสูตร
- `module1.html` ถึง `module4.html` - เนื้อหาแต่ละ module
- `quiz.html` - แบบทดสอบ
- `scorm-api.js` - SCORM API wrapper

### ขั้นตอนที่ 3: Package และ Upload

```bash
# Zip แต่ละหลักสูตร
zip -r generative-ai-professionals.zip generative-ai-professionals/
zip -r data-driven-decision-making.zip data-driven-decision-making/
zip -r cybersecurity-data-governance.zip cybersecurity-data-governance/
```

---

## 📋 Template Files

### 1. imsmanifest.xml (SCORM 2004)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="COURSE_ID" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  
  <organizations default="ORG-001">
    <organization identifier="ORG-001">
      <title>COURSE_TITLE</title>
      
      <item identifier="ITEM-001" identifierref="RES-001">
        <title>Course Overview</title>
      </item>
      
      <item identifier="ITEM-002" identifierref="RES-002">
        <title>Module 1</title>
      </item>
      
      <item identifier="ITEM-003" identifierref="RES-003">
        <title>Module 2</title>
      </item>
      
      <item identifier="ITEM-004" identifierref="RES-004">
        <title>Module 3</title>
      </item>
      
      <item identifier="ITEM-005" identifierref="RES-005">
        <title>Module 4</title>
      </item>
      
      <item identifier="ITEM-006" identifierref="RES-006">
        <title>Final Quiz</title>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-001" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="css/style.css"/>
      <file href="js/scorm-api.js"/>
    </resource>
    
    <resource identifier="RES-002" type="webcontent" adlcp:scormType="sco" href="module1.html">
      <file href="module1.html"/>
    </resource>
    
    <resource identifier="RES-003" type="webcontent" adlcp:scormType="sco" href="module2.html">
      <file href="module2.html"/>
    </resource>
    
    <resource identifier="RES-004" type="webcontent" adlcp:scormType="sco" href="module3.html">
      <file href="module3.html"/>
    </resource>
    
    <resource identifier="RES-005" type="webcontent" adlcp:scormType="sco" href="module4.html">
      <file href="module4.html"/>
    </resource>
    
    <resource identifier="RES-006" type="webcontent" adlcp:scormType="sco" href="quiz.html">
      <file href="quiz.html"/>
      <file href="js/quiz.js"/>
    </resource>
  </resources>
</manifest>
```

### 2. scorm-api.js (SCORM API Wrapper)

```javascript
// SCORM 2004 API Wrapper
var API = null;

function findAPI(win) {
  var attempts = 0;
  while (win.API_1484_11 == null && win.parent != null && win.parent != win && attempts < 7) {
    attempts++;
    win = win.parent;
  }
  return win.API_1484_11;
}

function getAPI() {
  if (API == null) {
    API = findAPI(window);
  }
  return API;
}

function initializeSCORM() {
  var api = getAPI();
  if (api) {
    api.Initialize("");
    return true;
  }
  return false;
}

function terminateSCORM() {
  var api = getAPI();
  if (api) {
    api.Terminate("");
    return true;
  }
  return false;
}

function setCompleted() {
  var api = getAPI();
  if (api) {
    api.SetValue("cmi.completion_status", "completed");
    api.Commit("");
  }
}

function setScore(score) {
  var api = getAPI();
  if (api) {
    api.SetValue("cmi.score.scaled", (score / 100).toString());
    api.SetValue("cmi.score.raw", score.toString());
    api.SetValue("cmi.score.min", "0");
    api.SetValue("cmi.score.max", "100");
    api.Commit("");
  }
}

function setPassed(passed) {
  var api = getAPI();
  if (api) {
    api.SetValue("cmi.success_status", passed ? "passed" : "failed");
    api.Commit("");
  }
}

// Initialize on page load
window.addEventListener('load', function() {
  initializeSCORM();
});

// Terminate on page unload
window.addEventListener('beforeunload', function() {
  terminateSCORM();
});
```

### 3. style.css (Modern Design)

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --success: #10b981;
  --danger: #ef4444;
  --dark: #1e293b;
  --light: #f8fafc;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: var(--dark);
  background: var(--light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.module {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.module h2 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

.quiz-question {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary);
}

.quiz-option {
  display: block;
  padding: 1rem;
  margin: 0.5rem 0;
  background: var(--light);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.quiz-option:hover {
  background: #e0e7ff;
}

.quiz-option.correct {
  background: #d1fae5;
  border-left: 4px solid var(--success);
}

.quiz-option.incorrect {
  background: #fee2e2;
  border-left: 4px solid var(--danger);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s;
}

.code-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  margin: 1rem 0;
}

.highlight {
  background: #fef3c7;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header {
    padding: 2rem 1rem;
  }
}
```

---

## 🎯 หลักสูตรที่ 1: Generative AI for Professionals

### Course Metadata
```javascript
{
  "id": "gen-ai-pro-2024",
  "title": "Generative AI for Professionals",
  "description": "ไม่ใช่แค่ Prompt - เรียนรู้ AI Architecture, API Integration, RAG และ Fine-tuning",
  "duration": 120,
  "level": "Intermediate-Advanced",
  "modules": 4,
  "quiz": 20,
  "passingScore": 80
}
```

### Module Structure
1. **Module 1:** Beyond Prompting - AI Architecture (30 min)
2. **Module 2:** Advanced Integration & API (30 min)
3. **Module 3:** RAG & Vector Databases (30 min)
4. **Module 4:** Fine-tuning & Production Deployment (30 min)
5. **Quiz:** 20 questions (80% passing)

### Key Features
- Interactive code examples (Python, JavaScript)
- Real-world case studies
- Hands-on projects
- Cost calculation tools
- Model comparison tables

---

## 📊 หลักสูตรที่ 2: Data-Driven Decision Making

### Course Metadata
```javascript
{
  "id": "data-driven-2024",
  "title": "Data-Driven Decision Making & Analytics",
  "description": "เรียนรู้การวิเคราะห์ข้อมูล BI Tools และการตัดสินใจด้วยข้อมูล",
  "duration": 110,
  "level": "Intermediate",
  "modules": 4,
  "quiz": 15,
  "passingScore": 75
}
```

### Module Structure
1. **Module 1:** Data Literacy & Analytics Fundamentals (25 min)
2. **Module 2:** Data Analysis Tools & Techniques (30 min)
3. **Module 3:** Data Visualization & Communication (25 min)
4. **Module 4:** Decision Frameworks & Business Impact (30 min)
5. **Quiz:** 15 questions (75% passing)

### Key Features
- SQL query examples
- Interactive dashboards
- Chart selection guide
- Framework templates
- ROI calculators

---

## 🔒 หลักสูตรที่ 3: Cybersecurity & Data Governance

### Course Metadata
```javascript
{
  "id": "cyber-gov-2024",
  "title": "Cybersecurity Awareness & Data Governance",
  "description": "เรียนรู้การป้องกันภัยไซเบอร์ PDPA และ Data Governance",
  "duration": 100,
  "level": "Beginner-Intermediate",
  "modules": 4,
  "quiz": 20,
  "passingScore": 80
}
```

### Module Structure
1. **Module 1:** Cybersecurity Fundamentals (25 min)
2. **Module 2:** Data Protection & Privacy (25 min)
3. **Module 3:** Data Governance Framework (25 min)
4. **Module 4:** Incident Response & Business Continuity (25 min)
5. **Quiz:** 20 questions (80% passing)

### Key Features
- Real phishing examples
- PDPA compliance checklist
- Incident response templates
- Data classification guide
- Security best practices

---

## 🛠️ Tools & Resources

### SCORM Creation Tools
1. **iSpring Suite** - PowerPoint to SCORM
2. **Articulate Storyline** - Professional authoring
3. **Adobe Captivate** - Interactive content
4. **H5P** - Open source HTML5
5. **SCORM Cloud** - Testing platform

### Testing Tools
- **SCORM Cloud** - https://cloud.scorm.com
- **Rustici SCORM Driver** - Free testing
- **Moodle** - Open source LMS

### Validation
```bash
# ตรวจสอบ SCORM package
1. Upload to SCORM Cloud
2. Test all navigation
3. Verify score tracking
4. Check completion status
5. Test on multiple browsers
```

---

## 📦 Package Checklist

### Before Packaging
- [ ] All HTML files validated
- [ ] SCORM API implemented
- [ ] Quiz scoring works
- [ ] Navigation tested
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] imsmanifest.xml valid

### After Packaging
- [ ] ZIP file < 100MB
- [ ] Test on SCORM Cloud
- [ ] Test on target LMS
- [ ] Mobile responsive
- [ ] All links work
- [ ] Completion tracked
- [ ] Score reported correctly

---

## 🚀 Upload to SkillNexus

### Step 1: Admin Dashboard
```
http://localhost:3000/dashboard/admin/courses
```

### Step 2: Create Course
1. Click "Create New Course"
2. Fill course details
3. Upload SCORM package (ZIP)
4. Set pricing and access

### Step 3: Test
1. Enroll as student
2. Complete all modules
3. Take quiz
4. Verify certificate

---

## 📈 Success Metrics

### Track These KPIs
- **Completion Rate:** Target 80%+
- **Quiz Pass Rate:** Target 75%+
- **Average Score:** Target 85%+
- **Time Spent:** Match estimated duration
- **Student Satisfaction:** Target 4.5/5

### Analytics to Monitor
- Module drop-off points
- Quiz question difficulty
- Time per module
- Replay frequency
- Certificate downloads

---

## 🎓 Next Steps

1. **Create SCORM packages** using templates
2. **Test thoroughly** on SCORM Cloud
3. **Upload to SkillNexus** LMS
4. **Assign to users** and collect feedback
5. **Iterate and improve** based on data

---

**📝 Note:** ใช้เอกสารนี้ร่วมกับ `SCORM-PROFESSIONAL-SERIES.md` สำหรับเนื้อหาละเอียด
