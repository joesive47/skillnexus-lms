const fs = require('fs');
const path = require('path');

const courses = {
  '1-ai-chatgpt-business': {
    title: 'AI & ChatGPT for Business',
    modules: [
      {title: 'AI Fundamentals', topics: ['What is AI, ML, Deep Learning', 'LLM Architecture', 'ChatGPT, Claude, Gemini', 'AI Capabilities & Limitations', 'Ethics & Responsible AI']},
      {title: 'Prompt Engineering', topics: ['Prompt Structure', 'Zero-shot vs Few-shot', 'Chain-of-Thought', 'Role-based Prompts', 'Advanced Techniques']},
      {title: 'Business Applications', topics: ['Content Creation', 'Customer Service', 'Data Analysis', 'Code Generation', 'Research & Summarization']},
      {title: 'AI Tools Ecosystem', topics: ['Midjourney, DALL-E', 'ElevenLabs (Voice)', 'Runway, Pika (Video)', 'API Integration', 'Workflow Automation']}
    ],
    quiz: 10
  },
  '2-data-analytics-bi': {
    title: 'Data Analytics & Business Intelligence',
    modules: [
      {title: 'Data Fundamentals', topics: ['Data Types & Structures', 'Data Quality & Cleaning', 'Statistical Concepts', 'Descriptive Analytics', 'KPI Framework']},
      {title: 'SQL & Database', topics: ['SQL Basics', 'Advanced Queries', 'Database Design', 'Query Optimization', 'Real-world Projects']},
      {title: 'Visualization & BI Tools', topics: ['Chart Types', 'Tableau/Power BI', 'Dashboard Design', 'Interactive Reports', 'Data Storytelling']},
      {title: 'Advanced Analytics', topics: ['Predictive Analytics', 'A/B Testing', 'Cohort Analysis', 'Customer Segmentation', 'Business Impact']}
    ],
    quiz: 10
  },
  '3-digital-marketing': {
    title: 'Digital Marketing Mastery',
    modules: [
      {title: 'Marketing Strategy', topics: ['Marketing Funnel', 'Customer Journey', 'Buyer Personas', 'Content Strategy', 'Marketing Mix']},
      {title: 'Social Media Marketing', topics: ['Platform Strategy', 'Content Creation', 'Community Management', 'Influencer Marketing', 'Social Commerce']},
      {title: 'Paid Advertising', topics: ['Google Ads', 'Facebook/Instagram Ads', 'TikTok Ads', 'Campaign Optimization', 'ROAS & Attribution']},
      {title: 'SEO & Content', topics: ['On-page & Off-page SEO', 'Keyword Research', 'Content Marketing', 'Email Marketing', 'Marketing Automation']}
    ],
    quiz: 10
  },
  '4-cybersecurity-pdpa': {
    title: 'Cybersecurity & PDPA Compliance',
    modules: [
      {title: 'Cybersecurity Basics', topics: ['Cyber Threats', 'Phishing & Social Engineering', 'Password Security & MFA', 'Secure Browsing', 'Mobile Security']},
      {title: 'PDPA & Data Protection', topics: ['PDPA Overview', 'Personal Data', 'Consent Management', 'Data Subject Rights', 'Cross-border Transfer']},
      {title: 'Data Governance', topics: ['Data Classification', 'Access Control', 'Encryption', 'Backup & Recovery', 'Incident Response']},
      {title: 'Compliance & Best Practices', topics: ['Security Policies', 'Employee Training', 'Vendor Management', 'Audit & Assessment', 'Continuous Improvement']}
    ],
    quiz: 10
  },
  '5-financial-literacy': {
    title: 'Financial Literacy & Investment',
    modules: [
      {title: 'Financial Fundamentals', topics: ['Income vs Expenses', 'Budgeting & Saving', 'Emergency Fund', 'Debt Management', 'Financial Goals']},
      {title: 'Investment Basics', topics: ['Risk vs Return', 'Asset Classes', 'Diversification', 'Investment Vehicles', 'Dollar Cost Averaging']},
      {title: 'Stock Market & Crypto', topics: ['Stock Market Basics', 'Fundamental Analysis', 'Technical Analysis', 'Cryptocurrency', 'Portfolio Management']},
      {title: 'Retirement & Wealth', topics: ['Retirement Planning', 'Tax-efficient Investing', 'Passive Income', 'Real Estate', 'Estate Planning']}
    ],
    quiz: 10
  },
  '6-ai-software-innovator': {
    title: 'AI Software Innovator',
    modules: [
      {title: 'AI Development Basics', topics: ['Python for AI', 'ML Libraries', 'Data Preprocessing', 'Model Training', 'Evaluation Metrics']},
      {title: 'Deep Learning', topics: ['Neural Networks', 'CNN for Images', 'RNN for Sequences', 'Transfer Learning', 'Model Optimization']},
      {title: 'NLP & LLMs', topics: ['Text Processing', 'Transformers', 'Fine-tuning', 'RAG Systems', 'Prompt Engineering']},
      {title: 'AI Applications', topics: ['Computer Vision', 'Chatbots', 'Recommendation Systems', 'Deployment', 'MLOps']}
    ],
    quiz: 10
  }
};

const basePath = 'c:\\API\\The-SkillNexus\\scorm-courses';

Object.keys(courses).forEach(courseId => {
  const course = courses[courseId];
  const coursePath = path.join(basePath, courseId);
  
  // Create modules
  course.modules.forEach((module, idx) => {
    const moduleNum = idx + 1;
    const nextModule = moduleNum < 4 ? `module${moduleNum + 1}.html` : 'quiz.html';
    
    const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${module.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script></head><body><div class="container"><div class="header"><h1>📚 Module ${moduleNum}</h1><p class="subtitle">${module.title}</p></div><div class="content"><div class="section"><h2>📚 เนื้อหาในบทเรียน</h2><div class="objectives"><h3>🎯 สิ่งที่จะได้เรียนรู้:</h3><ul>${module.topics.map(t => `<li>${t}</li>`).join('')}</ul></div></div><div class="section"><h2>💡 Key Concepts</h2><p>บทเรียนนี้จะช่วยให้คุณเข้าใจ ${module.title} อย่างลึกซึ้ง พร้อมตัวอย่างและแนวทางปฏิบัติที่ใช้ได้จริง</p><div class="tip-box"><strong>💡 Tips:</strong><ul><li>ศึกษาเนื้อหาอย่างละเอียด</li><li>ทำความเข้าใจแนวคิดหลัก</li><li>ลองนำไปประยุกต์ใช้</li></ul></div></div></div><div class="nav-buttons"><button class="btn btn-secondary" onclick="window.history.back()">← ย้อนกลับ</button><button class="btn btn-primary" onclick="window.location.href='${nextModule}';setComplete()">ถัดไป →</button></div></div></body></html>`;
    
    fs.writeFileSync(path.join(coursePath, `module${moduleNum}.html`), html);
  });
  
  // Create quiz
  const quizHtml = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>แบบทดสอบ: ${course.title}</title><link rel="stylesheet" href="shared/style.css"><script src="shared/scorm.js"></script><script src="shared/quiz.js"></script></head><body><div class="container"><div class="header"><h1>📝 แบบทดสอบ</h1><p class="subtitle">${course.title}</p></div><div class="content"><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div><div id="quiz-container"></div><div style="text-align:center;margin:30px 0"><button id="submit-btn" class="btn btn-primary" onclick="submitQuiz()" disabled style="opacity:0.5">ส่งคำตอบ</button></div><div id="result"></div></div></div><script>var questions=[${Array(course.quiz).fill(0).map((_, i) => `{question:"คำถามที่ ${i+1}",options:["ตัวเลือก A","ตัวเลือก B","ตัวเลือก C","ตัวเลือก D"],correct:${i%4}}`).join(',')}];loadQuiz(questions);</script></body></html>`;
  
  fs.writeFileSync(path.join(coursePath, 'quiz.html'), quizHtml);
  
  console.log(`✅ Created ${courseId}`);
});

console.log('🎉 All courses created!');
