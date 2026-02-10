// 🚀 สคริปต์สร้างหลักสูตร SCORM แบบ Premium
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating Premium SCORM Courses...\n');

// โครงสร้างหลักสูตร
const courses = {
  '17-ai-implementation': {
    title: 'AI Implementation Mastery',
    subtitle: 'การนำ AI ไปใช้งานจริงในองค์กร',
    icon: '🚀',
    modules: [
      { id: 1, title: 'AI Strategy & Planning', icon: '🎯', color: '#667eea' },
      { id: 2, title: 'Agentic AI Mastery', icon: '🤖', color: '#f5576c' },
      { id: 3, title: 'Implementation Guide', icon: '⚙️', color: '#4facfe' },
      { id: 4, title: 'Optimization & Scaling', icon: '📊', color: '#4caf50' }
    ]
  },
  'ai-automation-mastery': {
    title: 'AI Automation Mastery',
    subtitle: 'การใช้ AI ทำงานอัตโนมัติอย่างมืออาชีพ',
    icon: '⚡',
    modules: [
      { id: 1, title: 'Automation Strategy', icon: '🎯', color: '#667eea' },
      { id: 2, title: 'AI Tools & Platforms', icon: '🛠️', color: '#f5576c' },
      { id: 3, title: 'Workflow Design', icon: '🔄', color: '#4facfe' },
      { id: 4, title: 'Advanced Automation', icon: '🚀', color: '#4caf50' }
    ]
  }
};

// สร้างโฟลเดอร์
const baseDir = 'scorm-enhanced';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// สร้าง shared folder
const sharedDir = path.join(baseDir, 'shared');
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
}

console.log('✅ Created directory structure');

// สร้าง SCORM API wrapper
const scormJS = `
// SCORM 1.2 API Wrapper
var scormAPI = null;

function findAPI(win) {
  var attempts = 0;
  while (win.API == null && win.parent != null && win.parent != win && attempts < 7) {
    attempts++;
    win = win.parent;
  }
  return win.API;
}

function getAPI() {
  if (scormAPI == null) {
    scormAPI = findAPI(window);
  }
  return scormAPI;
}

function scormInit() {
  var api = getAPI();
  if (api != null) {
    api.LMSInitialize("");
    return true;
  }
  return false;
}

function scormFinish() {
  var api = getAPI();
  if (api != null) {
    api.LMSFinish("");
    return true;
  }
  return false;
}

function scormSetValue(name, value) {
  var api = getAPI();
  if (api != null) {
    api.LMSSetValue(name, value);
    api.LMSCommit("");
    return true;
  }
  return false;
}

function scormGetValue(name) {
  var api = getAPI();
  if (api != null) {
    return api.LMSGetValue(name);
  }
  return "";
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', function() {
    scormInit();
    scormSetValue('cmi.core.lesson_status', 'incomplete');
  });
  
  window.addEventListener('beforeunload', function() {
    scormSetValue('cmi.core.lesson_status', 'completed');
    scormFinish();
  });
}
`;

fs.writeFileSync(path.join(sharedDir, 'scorm.js'), scormJS);
console.log('✅ Created scorm.js');

// สร้าง imsmanifest.xml template
function createManifest(courseId, courseData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${courseId}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-${courseId}">
    <organization identifier="ORG-${courseId}">
      <title>${courseData.title}</title>
      <item identifier="ITEM-INDEX" identifierref="RES-INDEX">
        <title>Course Introduction</title>
      </item>
      ${courseData.modules.map((module, idx) => `
      <item identifier="ITEM-MODULE${module.id}" identifierref="RES-MODULE${module.id}">
        <title>Module ${module.id}: ${module.title}</title>
      </item>`).join('')}
      <item identifier="ITEM-QUIZ" identifierref="RES-QUIZ">
        <title>Final Assessment</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-INDEX" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="shared/premium-style.css"/>
      <file href="shared/interactive.js"/>
      <file href="shared/scorm.js"/>
    </resource>
    ${courseData.modules.map(module => `
    <resource identifier="RES-MODULE${module.id}" type="webcontent" adlcp:scormtype="sco" href="module${module.id}.html">
      <file href="module${module.id}.html"/>
      <file href="shared/premium-style.css"/>
      <file href="shared/interactive.js"/>
      <file href="shared/scorm.js"/>
    </resource>`).join('')}
    <resource identifier="RES-QUIZ" type="webcontent" adlcp:scormtype="sco" href="quiz.html">
      <file href="quiz.html"/>
      <file href="shared/premium-style.css"/>
      <file href="shared/interactive.js"/>
      <file href="shared/scorm.js"/>
      <file href="shared/quiz.js"/>
    </resource>
  </resources>
</manifest>`;
}

// สร้างหลักสูตรทั้งหมด
Object.keys(courses).forEach(courseId => {
  const courseData = courses[courseId];
  const courseDir = path.join(baseDir, courseId);
  
  if (!fs.existsSync(courseDir)) {
    fs.mkdirSync(courseDir, { recursive: true });
  }
  
  // สร้าง imsmanifest.xml
  const manifest = createManifest(courseId, courseData);
  fs.writeFileSync(path.join(courseDir, 'imsmanifest.xml'), manifest);
  
  console.log(`✅ Created ${courseId}/imsmanifest.xml`);
});

console.log('\n🎉 Premium SCORM courses created successfully!');
console.log('\n📝 Next steps:');
console.log('1. Run: update-scorm-courses.bat');
console.log('2. Test courses in browser');
console.log('3. Create ZIP packages');
console.log('4. Upload to LMS');
console.log('\n📖 Read PREMIUM-SCORM-GUIDE.md for details');
