# 🚀 สร้าง SCORM Packages - 3 หลักสูตร WOW

## 📦 หลักสูตรที่จะสร้าง

1. **AI Automation Mastery** (150 นาที)
2. **Personal Branding 2.0** (120 นาที)
3. **Video Content Mastery** (140 นาที)

---

## 🎯 ขั้นตอนการสร้าง

### Step 1: เตรียม Content Files

```bash
# สร้าง folder structure
mkdir C:\SCORM-NEW-COURSES
cd C:\SCORM-NEW-COURSES

# สร้าง 3 folders
mkdir 19-ai-automation-mastery
mkdir 20-personal-branding-2.0
mkdir 21-video-content-mastery
```

### Step 2: ใช้ SCORM Builder

```bash
# ใน project
cd c:\API\The-SkillNexus

# รัน SCORM builder (ถ้ามี)
npm run scorm:build
```

---

## 📝 สรุปเนื้อหาแต่ละหลักสูตร

### 🤖 Course 19: AI Automation Mastery

**โครงสร้าง:**
- Module 1: AI Automation Fundamentals (35 นาที)
- Module 2: No-Code Tools Mastery (40 นาที)
- Module 3: AI Chatbot & Agent (40 นาที)
- Module 4: ROI & Scaling (35 นาที)
- Quiz: 20 คำถาม

**Highlights:**
- ไม่ต้องเขียนโค้ด
- ROI 300-500%
- ประหยัดเวลา 20-40 ชม./สัปดาห์
- 7 Bonuses

**URL สำหรับ Deploy:**
- ควรอัพโหลดไปที่ Cloudflare R2 / Google Drive / AWS S3
- แนะนำ: `https://storage.uppowerskill.com/scorm/19-ai-automation/`

---

### 🌟 Course 20: Personal Branding 2.0

**โครงสร้าง:**
- Module 1: Personal Brand Foundation (30 นาที)
- Module 2: LinkedIn Mastery (30 นาที)
- Module 3: Content Creation Mastery (35 นาที)
- Module 4: Monetization & Growth (25 นาที)
- Quiz: 20 คำถาม

**Highlights:**
- Followers +200-500% ใน 3 เดือน
- รายได้เพิ่ม 50K-200K/เดือน
- 6 Revenue Streams
- 7 Bonuses

**URL สำหรับ Deploy:**
- `https://storage.uppowerskill.com/scorm/20-personal-branding/`

---

### 🎬 Course 21: Video Content Mastery

**โครงสร้าง:**
- Module 1: YouTube Algorithm Mastery (35 นาที)
- Module 2: TikTok & Shorts Viral Strategy (35 นาที)
- Module 3: Production & Equipment (35 นาที)
- Module 4: Monetization & Growth (35 นาที)
- Quiz: 25 คำถาม

**Highlights:**
- 0 → 100K subscribers ใน 6 เดือน
- 6 Revenue Streams
- Viral Formulas
- 10 Bonuses

**URL สำหรับ Deploy:**
- `https://storage.uppowerskill.com/scorm/21-video-content/`

---

## 🎨 Template HTML สำหรับแต่ละ Module

### index.html (Course Overview)
```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Course Title]</title>
    <link rel="stylesheet" href="shared/style.css">
</head>
<body>
    <div class="container">
        <h1>🚀 [Course Title]</h1>
        <p class="subtitle">[Course Subtitle]</p>
        
        <div class="course-info">
            <div class="info-item">
                <span class="icon">⏱️</span>
                <span>[Duration] นาที</span>
            </div>
            <div class="info-item">
                <span class="icon">📚</span>
                <span>[X] Modules</span>
            </div>
            <div class="info-item">
                <span class="icon">🎓</span>
                <span>Certificate</span>
            </div>
        </div>

        <div class="modules">
            <h2>📋 เนื้อหาหลักสูตร</h2>
            <div class="module-card">
                <h3>Module 1: [Title]</h3>
                <p>[Description]</p>
                <a href="module1.html" class="btn">เริ่มเรียน →</a>
            </div>
            <!-- Repeat for other modules -->
        </div>
    </div>
    <script src="shared/scorm.js"></script>
</body>
</html>
```

---

## 📄 imsmanifest.xml Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="[COURSE_ID]" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  
  <organizations default="ORG-[COURSE_ID]">
    <organization identifier="ORG-[COURSE_ID]">
      <title>[Course Title]</title>
      
      <item identifier="ITEM-OVERVIEW" identifierref="RES-OVERVIEW">
        <title>Course Overview</title>
      </item>
      
      <item identifier="ITEM-MODULE1" identifierref="RES-MODULE1">
        <title>Module 1: [Title]</title>
      </item>
      
      <item identifier="ITEM-MODULE2" identifierref="RES-MODULE2">
        <title>Module 2: [Title]</title>
      </item>
      
      <item identifier="ITEM-MODULE3" identifierref="RES-MODULE3">
        <title>Module 3: [Title]</title>
      </item>
      
      <item identifier="ITEM-MODULE4" identifierref="RES-MODULE4">
        <title>Module 4: [Title]</title>
      </item>
      
      <item identifier="ITEM-QUIZ" identifierref="RES-QUIZ">
        <title>Final Assessment</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="RES-OVERVIEW" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
    
    <resource identifier="RES-MODULE1" type="webcontent" adlcp:scormtype="sco" href="module1.html">
      <file href="module1.html"/>
    </resource>
    
    <resource identifier="RES-MODULE2" type="webcontent" adlcp:scormtype="sco" href="module2.html">
      <file href="module2.html"/>
    </resource>
    
    <resource identifier="RES-MODULE3" type="webcontent" adlcp:scormtype="sco" href="module3.html">
      <file href="module3.html"/>
    </resource>
    
    <resource identifier="RES-MODULE4" type="webcontent" adlcp:scormtype="sco" href="module4.html">
      <file href="module4.html"/>
    </resource>
    
    <resource identifier="RES-QUIZ" type="webcontent" adlcp:scormtype="sco" href="quiz.html">
      <file href="quiz.html"/>
    </resource>
    
    <resource identifier="RES-SHARED" type="webcontent">
      <file href="shared/style.css"/>
      <file href="shared/scorm.js"/>
      <file href="shared/quiz.js"/>
    </resource>
  </resources>
</manifest>
```

---

## 🎨 shared/style.css

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
    color: #667eea;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.subtitle {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
}

.course-info {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-radius: 10px;
}

.icon {
    font-size: 1.5rem;
}

.modules {
    margin-top: 3rem;
}

.module-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    border-left: 5px solid #667eea;
    transition: transform 0.3s;
}

.module-card:hover {
    transform: translateX(10px);
}

.btn {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    margin-top: 1rem;
    transition: background 0.3s;
}

.btn:hover {
    background: #764ba2;
}

.content-section {
    margin: 2rem 0;
}

.content-section h2 {
    color: #667eea;
    margin-bottom: 1rem;
}

.content-section h3 {
    color: #764ba2;
    margin: 1.5rem 0 0.5rem;
}

ul, ol {
    margin-left: 2rem;
    margin-bottom: 1rem;
}

li {
    margin-bottom: 0.5rem;
}

.highlight {
    background: #fff3cd;
    padding: 1rem;
    border-left: 4px solid #ffc107;
    margin: 1rem 0;
    border-radius: 5px;
}

.success {
    background: #d4edda;
    padding: 1rem;
    border-left: 4px solid #28a745;
    margin: 1rem 0;
    border-radius: 5px;
}

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #eee;
}

.complete-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
}

.complete-btn:hover {
    background: #218838;
}
```

---

## 🔧 shared/scorm.js

```javascript
class ScormAPI {
    constructor() {
        this.data = {};
        this.initialized = false;
    }

    LMSInitialize(param) {
        this.initialized = true;
        console.log("SCORM: Initialized");
        return "true";
    }

    LMSGetValue(key) {
        return this.data[key] || "";
    }

    LMSSetValue(key, value) {
        this.data[key] = value;
        console.log("SCORM Set:", key, "=", value);
        
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'scorm',
                action: 'setValue',
                key: key,
                value: value
            }, '*');
        }
        return "true";
    }

    LMSCommit(param) {
        console.log("SCORM: Commit", this.data);
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'scorm',
                action: 'commit',
                data: this.data
            }, '*');
        }
        return "true";
    }

    LMSFinish(param) {
        this.initialized = false;
        console.log("SCORM: Finished");
        return "true";
    }

    LMSGetLastError() { return "0"; }
    LMSGetErrorString(errorCode) { return "No error"; }
    LMSGetDiagnostic(errorCode) { return ""; }
}

// Initialize
if (typeof window !== 'undefined') {
    window.API = new ScormAPI();
    window.API.LMSInitialize("");
    window.API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    window.API.LMSSetValue("cmi.core.score.min", "0");
    window.API.LMSSetValue("cmi.core.score.max", "100");
}

// Complete function
function completeCourse() {
    window.API.LMSSetValue("cmi.core.lesson_status", "completed");
    window.API.LMSSetValue("cmi.core.score.raw", "100");
    window.API.LMSCommit("");
    alert("✅ บันทึกความคืบหน้าเรียบร้อย!");
}

// Auto-finish on page unload
window.addEventListener('beforeunload', () => {
    window.API.LMSFinish("");
});
```

---

## 📦 ขั้นตอนสุดท้าย

### 1. สร้างไฟล์ทั้งหมด
- index.html
- module1.html, module2.html, module3.html, module4.html
- quiz.html
- imsmanifest.xml
- shared/style.css
- shared/scorm.js
- shared/quiz.js

### 2. Zip Package
```bash
# Windows
Compress-Archive -Path "19-ai-automation-mastery\*" -DestinationPath "19-ai-automation-mastery.zip"
```

### 3. Upload to Storage
- Cloudflare R2 (แนะนำ - ฟรี bandwidth)
- Google Drive (ง่าย)
- AWS S3 (professional)

### 4. เพิ่มใน Database
```sql
INSERT INTO lessons (courseId, title, type, launchUrl, order)
VALUES 
('course_id', 'AI Automation Mastery', 'SCORM', 
'https://storage.uppowerskill.com/scorm/19-ai-automation/index.html', 1);
```

---

## ✅ Checklist

- [ ] สร้าง 3 folders
- [ ] สร้าง HTML files ทั้งหมด
- [ ] สร้าง imsmanifest.xml
- [ ] สร้าง shared files (CSS, JS)
- [ ] Test locally
- [ ] Zip packages
- [ ] Upload to storage
- [ ] เพิ่มใน database
- [ ] Test บน LMS

---

**🎉 พร้อม Deploy แล้ว!**

**Next:** ต้องการให้สร้าง HTML files เต็มรูปแบบไหมครับ?
