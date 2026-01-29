const fs = require('fs');
const path = require('path');

const courses = {
  '14-digital-strategy': {
    id: 'DIGITAL_STRAT_2024',
    title: 'Digital Strategy &amp; Transformation Workshop',
    modules: [
      {title: 'Digital Maturity Assessment', topics: ['Digital Maturity Model', 'Industry Benchmarking', 'Gap Analysis Template', 'Assessment Framework', '🛠️ Workshop: ประเมินองค์กรของคุณ']},
      {title: 'Digital Strategy Canvas', topics: ['Business Model Canvas', 'Value Proposition Design', 'Digital Roadmap Planning', 'Strategic Priorities', '🛠️ Workshop: สร้าง Digital Strategy']},
      {title: 'Change Management Plan', topics: ['Stakeholder Mapping', 'Communication Plan', 'Resistance Management', 'Training Strategy', '🛠️ Workshop: วางแผน Change Management']},
      {title: 'Quick Wins &amp; Pilot Projects', topics: ['Project Prioritization Matrix', 'Pilot Project Design', 'Success Metrics', '90-Day Action Plan', '🛠️ Workshop: เลือก Quick Wins']}
    ],
    quiz: 20
  },
  '15-nocode-bootcamp': {
    id: 'NOCODE_BOOT_2024',
    title: 'No-Code/Low-Code Development Bootcamp',
    modules: [
      {title: 'Build Your First App', topics: ['Airtable Basics', 'Forms &amp; Views', 'Automations', 'Integrations', '🛠️ Project: Simple CRM System']},
      {title: 'Workflow Automation', topics: ['Zapier/Make Fundamentals', 'Trigger &amp; Actions', 'Multi-step Workflows', 'Error Handling', '🛠️ Project: Lead Generation Automation']},
      {title: 'Website &amp; Landing Page', topics: ['Webflow/Framer Basics', 'Responsive Design', 'CMS Integration', 'SEO Basics', '🛠️ Project: Product Landing Page']},
      {title: 'Internal Tools &amp; Dashboards', topics: ['Retool/Appsmith', 'Data Connections', 'UI Components', 'User Permissions', '🛠️ Project: Sales Dashboard']}
    ],
    quiz: 15
  },
  '16-data-analytics-leaders': {
    id: 'DATA_LEAD_2024',
    title: 'Data Analytics for Leaders (Hands-on)',
    modules: [
      {title: 'Excel Power User', topics: ['Power Query', 'Pivot Tables Advanced', 'DAX Formulas', 'Data Modeling', '🛠️ Project: Sales Performance Dashboard']},
      {title: 'SQL for Business Analysis', topics: ['SELECT, JOIN, GROUP BY', 'Window Functions', 'CTEs', 'Query Optimization', '🛠️ Project: Customer Cohort Analysis']},
      {title: 'Data Visualization', topics: ['Tableau/Power BI', 'Chart Selection', 'Dashboard Design', 'Storytelling', '🛠️ Project: Executive Dashboard']},
      {title: 'Predictive Analytics Intro', topics: ['Google Sheets ML', 'Trend Analysis', 'Forecasting', 'Model Evaluation', '🛠️ Project: Sales Forecast Model']}
    ],
    quiz: 15
  },
  '17-ai-implementation': {
    id: 'AI_IMPL_2024',
    title: 'AI Implementation Workshop',
    modules: [
      {title: 'AI Use Case Discovery', topics: ['Process Mapping', 'AI Opportunity Matrix', 'ROI Estimation', 'Prioritization', '🛠️ Workshop: หา AI Use Cases']},
      {title: 'Build AI Chatbot', topics: ['ChatGPT API', 'Prompt Engineering', 'Integration', 'Testing', '🛠️ Project: Customer Service Bot']},
      {title: 'Document Processing Automation', topics: ['OCR &amp; Text Extraction', 'AI Classification', 'Data Extraction', 'Workflow Integration', '🛠️ Project: Invoice Processing']},
      {title: 'AI-Powered Analytics', topics: ['Natural Language to SQL', 'Automated Insights', 'Report Generation', 'Deployment', '🛠️ Project: AI Business Analyst']}
    ],
    quiz: 20
  },
  '18-capstone-project': {
    id: 'CAPSTONE_2024',
    title: 'Digital Leadership Capstone Project',
    modules: [
      {title: 'Project Planning', topics: ['Project Charter', 'Stakeholder Analysis', 'Resource Planning', 'Timeline', '🛠️ Workshop: วางแผนโปรเจกต์จริง']},
      {title: 'Build &amp; Implement', topics: ['Choose Your Project', 'Development', 'Testing', 'Iteration', '🛠️ Hands-on: สร้างโซลูชันจริง']},
      {title: 'Measure &amp; Optimize', topics: ['KPI Dashboard', 'A/B Testing', 'User Feedback', 'Optimization', '🛠️ Workshop: วัดผลและปรับปรุง']},
      {title: 'Present &amp; Scale', topics: ['Executive Presentation', 'Scaling Strategy', 'Change Management', 'Next Steps', '🛠️ Workshop: นำเสนอและขยายผล']}
    ],
    quiz: 10
  }
};

const basePath = 'c:\\API\\The-SkillNexus\\scorm-courses';

Object.keys(courses).forEach(courseId => {
  const course = courses[courseId];
  const coursePath = path.join(basePath, courseId);
  
  // Create manifest
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${course.id}" version="1.0" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3">
<metadata><schema>ADL SCORM</schema><schemaversion>2004 4th Edition</schemaversion></metadata>
<organizations default="ORG">
<organization identifier="ORG"><title>${course.title}</title>
${course.modules.map((m, i) => `<item identifier="M${i+1}" identifierref="R${i+1}"><title>Module ${i+1}: ${m.title}</title></item>`).join('\n')}
<item identifier="Q" identifierref="RQ"><title>แบบทดสอบ</title></item>
</organization>
</organizations>
<resources>
${course.modules.map((_, i) => `<resource identifier="R${i+1}" type="webcontent" adlcp:scormType="sco" href="module${i+1}.html"><file href="module${i+1}.html"/><file href="shared/style.css"/><file href="shared/scorm.js"/></resource>`).join('\n')}
<resource identifier="RQ" type="webcontent" adlcp:scormType="sco" href="quiz.html"><file href="quiz.html"/><file href="shared/style.css"/><file href="shared/scorm.js"/><file href="shared/quiz.js"/></resource>
</resources>
</manifest>`;
  
  fs.writeFileSync(path.join(coursePath, 'imsmanifest.xml'), manifest);
  
  // Create modules with hands-on emphasis
  course.modules.forEach((module, idx) => {
    const moduleNum = idx + 1;
    const nextModule = moduleNum < 4 ? `module${moduleNum + 1}.html` : 'quiz.html';
    
    const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${module.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script></head><body><div class="container"><div class="header"><h1>🛠️ Module ${moduleNum}</h1><p class="subtitle">${module.title}</p><div class="badge">Hands-on Workshop</div></div><div class="content"><div class="section"><h2>🎯 Workshop Objectives</h2><div class="objectives"><h3>สิ่งที่คุณจะได้ลงมือทำ:</h3><ul>${module.topics.map(t => `<li>${t}</li>`).join('')}</ul></div></div><div class="section"><h2>🛠️ Hands-on Activities</h2><div class="tip-box"><strong>💡 Workshop Format:</strong><ul><li><strong>70% Practice:</strong> ลงมือทำจริง</li><li><strong>20% Guidance:</strong> คำแนะนำและตัวอย่าง</li><li><strong>10% Theory:</strong> ทฤษฎีที่จำเป็น</li></ul></div><div class="example-box"><h3>📋 Deliverable:</h3><p>เมื่อจบ Module นี้ คุณจะได้:</p><ul><li>✅ เอกสาร/ไฟล์ที่สมบูรณ์</li><li>✅ Template ที่ใช้ได้จริง</li><li>✅ ความรู้ที่นำไปใช้ทันที</li></ul></div></div><div class="section"><h2>🚀 Step-by-Step Guide</h2><div class="warning-box"><strong>⚠️ Important:</strong><p>เตรียมเครื่องมือและข้อมูลให้พร้อมก่อนเริ่ม Workshop</p></div><p>ทำตามขั้นตอนในเอกสาร Workshop Guide ที่แนบมาพร้อมหลักสูตร</p></div><div class="section"><h2>💼 Real-World Application</h2><p>สิ่งที่คุณสร้างใน Module นี้สามารถนำไปใช้ในองค์กรของคุณได้ทันที ไม่ว่าจะเป็น:</p><ul><li>นำเสนอต่อผู้บริหาร</li><li>ใช้เป็น Template สำหรับทีม</li><li>ปรับแต่งให้เหมาะกับบริบทของคุณ</li><li>ขยายผลไปยังโปรเจกต์อื่น</li></ul></div></div><div class="nav-buttons"><button class="btn btn-secondary" onclick="window.history.back()">← ย้อนกลับ</button><button class="btn btn-primary" onclick="window.location.href='${nextModule}';setComplete()">ถัดไป →</button></div></div><style>.badge{background:linear-gradient(135deg,#10b981,#059669);color:white;padding:8px 16px;border-radius:20px;display:inline-block;margin-top:10px;font-size:0.9rem;font-weight:600}</style></body></html>`;
    
    fs.writeFileSync(path.join(coursePath, `module${moduleNum}.html`), html);
  });
  
  // Create quiz
  const quizHtml = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>แบบทดสอบ: ${course.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script><script src="shared/quiz.js"></script></head><body><div class="container"><div class="header"><h1>📝 แบบทดสอบ</h1><p class="subtitle">${course.title}</p></div><div class="content"><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div><div id="quiz-container"></div><div style="text-align:center;margin:30px 0"><button id="submit-btn" class="btn btn-primary" onclick="submitQuiz()" disabled style="opacity:0.5">ส่งคำตอบ</button></div><div id="result"></div></div></div><script>var questions=[${Array(course.quiz).fill(0).map((_, i) => `{question:"Scenario ${i+1}: ${course.modules[i % 4].title}",options:["แนวทาง A","แนวทาง B","แนวทาง C","แนวทาง D"],correct:${i%4}}`).join(',')}];loadQuiz(questions);</script></body></html>`;
  
  fs.writeFileSync(path.join(coursePath, 'quiz.html'), quizHtml);
  
  console.log(`✅ Created ${courseId}`);
});

console.log('🎉 Digital Leadership Series (5 courses) created!');
