# 🚀 SCORM 2004 Implementation Guide

## 📋 คู่มือการนำ SCORM Courses ไปใช้งาน

---

## 🎯 Overview

คู่มือนี้จะแนะนำวิธีการ Upload, Configure และใช้งาน SCORM 2004 Courses บน LMS ต่างๆ

---

## 📦 SCORM Package Structure

### Standard SCORM 2004 Package

```
course-package.zip
├── imsmanifest.xml              # Required: SCORM manifest file
├── adlcp_rootv1p2.xsd          # SCORM schema
├── ims_xml.xsd                  # IMS schema  
├── imscp_rootv1p1p2.xsd        # Content packaging schema
├── imsmd_rootv1p2p1.xsd        # Metadata schema
├── index.html                   # Course entry point
├── shared/
│   └── scormdriver.js          # SCORM API wrapper
├── modules/
│   ├── module1/
│   ├── module2/
│   └── ...
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── videos/
└── resources/
    ├── pdfs/
    └── downloads/
```

### Key Files Explained

**imsmanifest.xml**
- ไฟล์หลักของ SCORM package
- กำหนดโครงสร้างหลักสูตร
- ระบุ SCOs (Sharable Content Objects)
- กำหนด Sequencing rules

**index.html**
- จุดเริ่มต้นของหลักสูตร
- เชื่อมต่อกับ SCORM API
- โหลด course content

**scormdriver.js**
- JavaScript wrapper สำหรับ SCORM API
- จัดการ LMS communication
- Track progress และ scores

---

## 🔧 LMS Integration

### 1. Moodle

**Upload Steps:**
```
1. Login as Admin/Teacher
2. Go to Course → Add an activity → SCORM package
3. Upload .zip file
4. Configure settings:
   - Display: New window
   - Width: 100%
   - Height: 600px
   - Grading method: Highest attempt
5. Save and display
```

**Moodle Settings:**
```php
// config.php
$CFG->scorm_updatefreq = 0; // Always update
$CFG->scorm_maxattempt = 0; // Unlimited attempts
$CFG->scorm_forcenewattempt = 0; // Continue previous
```

---

### 2. Canvas LMS

**Upload Steps:**
```
1. Go to Course → Settings → Apps
2. Add SCORM Cloud app (if not installed)
3. Go to Modules → Add Item → External Tool
4. Select SCORM Cloud
5. Upload .zip package
6. Configure launch settings
```

**Canvas API Integration:**
```javascript
// Upload via API
const formData = new FormData();
formData.append('file', scormPackage);

fetch('/api/v1/courses/:course_id/files', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

---

### 3. Blackboard Learn

**Upload Steps:**
```
1. Course Tools → SCORM Engine
2. Upload Package
3. Set Registration Options:
   - Allow multiple attempts
   - Track completion
   - Report scores
4. Add to Content Area
```

---

### 4. TalentLMS

**Upload Steps:**
```
1. Courses → Add Course → SCORM
2. Upload .zip file
3. Settings:
   - Completion: Based on SCORM data
   - Attempts: Unlimited
   - Certificate: Auto-issue on completion
4. Publish course
```

---

### 5. SkillNexus LMS (Custom)

**Upload via Admin Panel:**
```
1. Dashboard → Courses → Upload SCORM
2. Drag & drop .zip file
3. Auto-extract and validate
4. Configure:
   - Course category
   - Access permissions
   - Completion criteria
5. Publish
```

**Upload via API:**
```javascript
// POST /api/courses/scorm/upload
const uploadSCORM = async (file) => {
  const formData = new FormData();
  formData.append('scorm_package', file);
  formData.append('category', 'corporate-training');
  formData.append('auto_publish', true);

  const response = await fetch('/api/courses/scorm/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};
```

---

## 🔍 SCORM Validation

### Pre-Upload Validation

**1. Use SCORM Validator Tools:**
- ADL SCORM Test Suite
- Rustici SCORM Cloud
- SCORM.com Validator

**2. Check Required Files:**
```bash
# Verify package structure
unzip -l course-package.zip | grep imsmanifest.xml
unzip -l course-package.zip | grep index.html
```

**3. Validate XML:**
```xml
<!-- imsmanifest.xml must have -->
<manifest identifier="unique-id" version="1.0">
  <metadata>...</metadata>
  <organizations>
    <organization identifier="org-1">
      <item identifier="item-1" identifierref="resource-1">
        <title>Course Title</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource-1" type="webcontent" 
              adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
```

---

## 📊 SCORM Data Tracking

### Core Data Elements

**cmi.core.student_id**
- Student identifier
- Set by LMS

**cmi.core.student_name**
- Student name
- Set by LMS

**cmi.core.lesson_status**
- Values: not attempted, incomplete, completed, passed, failed
- Set by course

**cmi.core.score.raw**
- Numeric score (0-100)
- Set by course

**cmi.core.session_time**
- Time spent in session
- Format: PThhHmmMss.sS

**cmi.core.total_time**
- Cumulative time
- Calculated by LMS

### JavaScript Implementation

```javascript
// Initialize SCORM
function initSCORM() {
  const API = findAPI(window);
  if (API) {
    API.LMSInitialize("");
    
    // Get student info
    const studentName = API.LMSGetValue("cmi.core.student_name");
    const studentId = API.LMSGetValue("cmi.core.student_id");
    
    // Get previous status
    const lessonStatus = API.LMSGetValue("cmi.core.lesson_status");
    const score = API.LMSGetValue("cmi.core.score.raw");
    
    return { API, studentName, studentId, lessonStatus, score };
  }
  return null;
}

// Set completion
function setComplete(score) {
  const API = findAPI(window);
  if (API) {
    API.LMSSetValue("cmi.core.lesson_status", "completed");
    API.LMSSetValue("cmi.core.score.raw", score);
    API.LMSSetValue("cmi.core.score.min", "0");
    API.LMSSetValue("cmi.core.score.max", "100");
    API.LMSCommit("");
  }
}

// Finish course
function finishCourse() {
  const API = findAPI(window);
  if (API) {
    API.LMSFinish("");
  }
}

// Find SCORM API
function findAPI(win) {
  let attempts = 0;
  const maxAttempts = 500;
  
  while (win && attempts < maxAttempts) {
    if (win.API) return win.API;
    if (win.API_1484_11) return win.API_1484_11;
    
    if (win.parent && win.parent != win) {
      attempts++;
      win = win.parent;
    } else {
      break;
    }
  }
  return null;
}
```

---

## 🎯 Completion Criteria

### Setting Completion Rules

**1. Completion by Status:**
```javascript
// Mark as completed
API.LMSSetValue("cmi.core.lesson_status", "completed");
```

**2. Completion by Score:**
```javascript
// Pass if score >= 80%
const score = calculateScore();
API.LMSSetValue("cmi.core.score.raw", score);
API.LMSSetValue("cmi.core.lesson_status", score >= 80 ? "passed" : "failed");
```

**3. Completion by Time:**
```javascript
// Track time spent
const startTime = new Date();
// ... learning activities ...
const endTime = new Date();
const sessionTime = formatTime(endTime - startTime);
API.LMSSetValue("cmi.core.session_time", sessionTime);
```

**4. Completion by Progress:**
```javascript
// Track page views
let pagesViewed = 0;
const totalPages = 10;

function trackProgress() {
  pagesViewed++;
  const progress = (pagesViewed / totalPages) * 100;
  
  if (progress >= 100) {
    API.LMSSetValue("cmi.core.lesson_status", "completed");
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

**1. SCORM Package Won't Upload**

**Problem:** File size too large
```
Solution:
- Compress videos (use H.264, reduce bitrate)
- Optimize images (WebP format)
- Remove unnecessary files
- Split into multiple SCOs
```

**Problem:** Invalid manifest
```
Solution:
- Validate XML syntax
- Check schema references
- Verify all referenced files exist
- Use SCORM validator tool
```

---

**2. Course Won't Launch**

**Problem:** API not found
```javascript
// Debug API connection
console.log("Looking for API...");
const API = findAPI(window);
if (!API) {
  console.error("SCORM API not found!");
  alert("Please launch this course from your LMS");
}
```

**Problem:** Cross-origin issues
```
Solution:
- Ensure course is hosted on same domain as LMS
- Configure CORS headers if needed
- Check browser console for errors
```

---

**3. Progress Not Saving**

**Problem:** LMSCommit not called
```javascript
// Always commit after setting values
API.LMSSetValue("cmi.core.lesson_status", "completed");
API.LMSCommit(""); // Important!
```

**Problem:** Session not terminated
```javascript
// Always finish properly
window.addEventListener('beforeunload', function() {
  if (API) {
    API.LMSFinish("");
  }
});
```

---

**4. Scores Not Reporting**

**Problem:** Score format incorrect
```javascript
// Correct format
API.LMSSetValue("cmi.core.score.raw", "85");
API.LMSSetValue("cmi.core.score.min", "0");
API.LMSSetValue("cmi.core.score.max", "100");

// Wrong format
API.LMSSetValue("cmi.core.score.raw", 85); // Should be string
API.LMSSetValue("cmi.core.score.raw", "85%"); // No percentage sign
```

---

## 📱 Mobile Optimization

### Responsive Design

```css
/* Mobile-first approach */
@media (max-width: 768px) {
  .course-content {
    font-size: 16px;
    padding: 10px;
  }
  
  .video-container {
    width: 100%;
    height: auto;
  }
  
  .quiz-options {
    display: block;
  }
}
```

### Touch-Friendly Interactions

```javascript
// Support both click and touch
element.addEventListener('click', handleInteraction);
element.addEventListener('touchend', handleInteraction);

function handleInteraction(e) {
  e.preventDefault();
  // Handle interaction
}
```

---

## 🔒 Security Best Practices

### 1. Validate User Input
```javascript
function sanitizeInput(input) {
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]+>/g, '');
}
```

### 2. Secure API Communication
```javascript
// Use HTTPS only
if (location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### 3. Prevent Cheating
```javascript
// Disable right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable console
console.log = function() {};

// Detect tab switching
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Log suspicious activity
    logActivity('tab_switched');
  }
});
```

---

## 📈 Analytics & Reporting

### Custom Tracking

```javascript
// Track custom interactions
function trackInteraction(type, data) {
  const interactions = API.LMSGetValue("cmi.interactions._count");
  const index = parseInt(interactions) || 0;
  
  API.LMSSetValue(`cmi.interactions.${index}.id`, `interaction-${index}`);
  API.LMSSetValue(`cmi.interactions.${index}.type`, type);
  API.LMSSetValue(`cmi.interactions.${index}.result`, data.result);
  API.LMSSetValue(`cmi.interactions.${index}.latency`, data.time);
  API.LMSCommit("");
}

// Usage
trackInteraction('quiz', {
  result: 'correct',
  time: '00:00:15'
});
```

### Generate Reports

```javascript
// Export learning data
function exportLearningData() {
  return {
    studentId: API.LMSGetValue("cmi.core.student_id"),
    studentName: API.LMSGetValue("cmi.core.student_name"),
    status: API.LMSGetValue("cmi.core.lesson_status"),
    score: API.LMSGetValue("cmi.core.score.raw"),
    totalTime: API.LMSGetValue("cmi.core.total_time"),
    interactions: getInteractions()
  };
}
```

---

## ✅ Pre-Launch Checklist

### Before Uploading to LMS

- [ ] SCORM package validated
- [ ] All files included in .zip
- [ ] imsmanifest.xml correct
- [ ] index.html launches properly
- [ ] SCORM API connection works
- [ ] Progress tracking functional
- [ ] Scores reporting correctly
- [ ] Completion criteria set
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Videos play correctly
- [ ] Images load properly
- [ ] Links work
- [ ] Quiz functionality tested
- [ ] Certificate generation works

### After Upload

- [ ] Course launches in LMS
- [ ] Student can access
- [ ] Progress saves
- [ ] Scores report to gradebook
- [ ] Completion triggers certificate
- [ ] Mobile access works
- [ ] Multiple attempts allowed (if needed)
- [ ] Bookmarking works
- [ ] Time tracking accurate
- [ ] Reports generate correctly

---

## 📞 Support Resources

### SCORM Resources
- **ADL SCORM:** https://adlnet.gov/projects/scorm/
- **SCORM.com:** https://scorm.com/
- **Rustici Software:** https://rusticisoftware.com/

### Testing Tools
- **SCORM Cloud:** https://cloud.scorm.com/
- **ADL Test Suite:** Download from ADL website
- **Browser DevTools:** F12 for debugging

### Community
- **SCORM Users Group:** LinkedIn
- **Stack Overflow:** Tag [scorm]
- **GitHub:** SCORM examples and libraries

---

## 🎓 Best Practices Summary

1. **Always validate** SCORM packages before upload
2. **Test thoroughly** on target LMS
3. **Optimize file sizes** for faster loading
4. **Use responsive design** for mobile
5. **Implement proper error handling**
6. **Track meaningful data** for analytics
7. **Follow SCORM standards** strictly
8. **Provide clear instructions** to learners
9. **Monitor completion rates** and adjust
10. **Keep content updated** regularly

---

**🚀 Ready to Deploy Your SCORM Courses!**

*Last Updated: January 2025*
