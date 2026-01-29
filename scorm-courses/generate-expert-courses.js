const fs = require('fs');
const path = require('path');

const courses = {
  '10-agile-leadership': {
    id: 'AGILE_LEAD_2024',
    title: 'Agile Leadership &amp; Team Management',
    modules: [
      {title: 'Agile Mindset &amp; Frameworks', topics: ['Agile Manifesto &amp; Principles', 'Scrum Framework', 'Kanban Method', 'SAFe (Scaled Agile)', 'Choosing Right Framework']},
      {title: 'Remote Team Management', topics: ['Hybrid Work Models', 'Virtual Collaboration Tools', 'Async Communication', 'Building Trust Remotely', 'Managing Time Zones']},
      {title: 'OKR &amp; Performance Management', topics: ['OKR Framework', 'Setting Objectives', 'Key Results Measurement', 'Performance Reviews', 'Continuous Feedback']},
      {title: 'Coaching &amp; Mentoring', topics: ['Coaching vs Mentoring', 'Active Listening', 'Powerful Questions', 'Growth Mindset', 'Career Development']}
    ],
    quiz: 15
  },
  '11-product-management': {
    id: 'PROD_MGT_2024',
    title: 'Product Management Mastery',
    modules: [
      {title: 'Product Strategy &amp; Vision', topics: ['Product-Market Fit', 'North Star Metric', 'Value Proposition', 'Competitive Analysis', 'Product Vision']},
      {title: 'User Research &amp; Discovery', topics: ['Jobs-to-be-Done', 'User Interviews', 'Surveys &amp; Analytics', 'Persona Development', 'Customer Journey Mapping']},
      {title: 'Roadmap &amp; Prioritization', topics: ['RICE Framework', 'Kano Model', 'ICE Scoring', 'Roadmap Creation', 'Stakeholder Management']},
      {title: 'Product Analytics &amp; Growth', topics: ['Key Metrics (AARRR)', 'A/B Testing', 'Retention Analysis', 'Growth Loops', 'Product-Led Growth']}
    ],
    quiz: 20
  },
  '12-growth-hacking': {
    id: 'GROWTH_HACK_2024',
    title: 'Growth Hacking &amp; Viral Marketing',
    modules: [
      {title: 'Growth Hacking Mindset', topics: ['Growth vs Marketing', 'AARRR Framework', 'Growth Loops', 'North Star Metric', 'Experimentation Culture']},
      {title: 'Viral Mechanics', topics: ['Network Effects', 'Viral Coefficient', 'K-Factor', 'Viral Loops', 'Social Proof']},
      {title: 'Referral Programs', topics: ['Referral Design', 'Incentive Structures', 'Double-Sided Rewards', 'Tracking &amp; Attribution', 'Case Studies (Dropbox, Airbnb)']},
      {title: 'Growth Experiments', topics: ['Experiment Framework', 'Hypothesis Testing', 'Rapid Iteration', 'Metrics &amp; Analytics', 'Scaling Winners']}
    ],
    quiz: 12
  },
  '13-cloud-devops': {
    id: 'CLOUD_DEVOPS_2024',
    title: 'Cloud Architecture &amp; DevOps',
    modules: [
      {title: 'Cloud Fundamentals', topics: ['AWS vs Azure vs GCP', 'Compute (EC2, Lambda)', 'Storage (S3, EBS)', 'Networking (VPC, CDN)', 'Cost Optimization']},
      {title: 'Infrastructure as Code', topics: ['Terraform Basics', 'CloudFormation', 'State Management', 'Modules &amp; Reusability', 'Best Practices']},
      {title: 'CI/CD Pipeline', topics: ['Git Workflow', 'Jenkins/GitHub Actions', 'Build &amp; Test', 'Deployment Strategies', 'GitOps']},
      {title: 'Monitoring &amp; Observability', topics: ['Logging (ELK Stack)', 'Metrics (Prometheus)', 'Tracing (Jaeger)', 'Alerting', 'Incident Management']}
    ],
    quiz: 15
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
  
  // Create modules
  course.modules.forEach((module, idx) => {
    const moduleNum = idx + 1;
    const nextModule = moduleNum < 4 ? `module${moduleNum + 1}.html` : 'quiz.html';
    
    const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${module.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script></head><body><div class="container"><div class="header"><h1>📚 Module ${moduleNum}</h1><p class="subtitle">${module.title}</p></div><div class="content"><div class="section"><h2>📚 เนื้อหาในบทเรียน</h2><div class="objectives"><h3>🎯 สิ่งที่จะได้เรียนรู้:</h3><ul>${module.topics.map(t => `<li>${t}</li>`).join('')}</ul></div></div><div class="section"><h2>💡 Key Concepts</h2><p>บทเรียนนี้จะช่วยให้คุณเข้าใจ ${module.title} อย่างลึกซึ้ง พร้อมตัวอย่างและแนวทางปฏิบัติที่ใช้ได้จริง</p><div class="tip-box"><strong>💡 Tips:</strong><ul><li>ศึกษาเนื้อหาอย่างละเอียด</li><li>ทำความเข้าใจแนวคิดหลัก</li><li>ลองนำไปประยุกต์ใช้</li><li>ฝึกฝนอย่างสม่ำเสมอ</li></ul></div></div><div class="section"><h2>🎯 Practical Application</h2><div class="example-box"><h3>💡 ตัวอย่างการใช้งานจริง:</h3><p>เนื้อหาในบทเรียนนี้สามารถนำไปใช้ในการทำงานจริงได้ทันที ไม่ว่าจะเป็นการวางแผน การดำเนินการ หรือการวัดผล</p></div></div></div><div class="nav-buttons"><button class="btn btn-secondary" onclick="window.history.back()">← ย้อนกลับ</button><button class="btn btn-primary" onclick="window.location.href='${nextModule}';setComplete()">ถัดไป →</button></div></div></body></html>`;
    
    fs.writeFileSync(path.join(coursePath, `module${moduleNum}.html`), html);
  });
  
  // Create quiz
  const quizHtml = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>แบบทดสอบ: ${course.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script><script src="shared/quiz.js"></script></head><body><div class="container"><div class="header"><h1>📝 แบบทดสอบ</h1><p class="subtitle">${course.title}</p></div><div class="content"><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div><div id="quiz-container"></div><div style="text-align:center;margin:30px 0"><button id="submit-btn" class="btn btn-primary" onclick="submitQuiz()" disabled style="opacity:0.5">ส่งคำตอบ</button></div><div id="result"></div></div></div><script>var questions=[${Array(course.quiz).fill(0).map((_, i) => `{question:"คำถามที่ ${i+1}: เกี่ยวกับ ${course.modules[i % 4].title}",options:["ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D"],correct:${i%4}}`).join(',')}];loadQuiz(questions);</script></body></html>`;
  
  fs.writeFileSync(path.join(coursePath, 'quiz.html'), quizHtml);
  
  console.log(`✅ Created ${courseId}`);
});

console.log('🎉 All 4 expert courses created!');
