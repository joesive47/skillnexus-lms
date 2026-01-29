const fs = require('fs');
const path = require('path');

const manifests = {
  '3-digital-marketing': {id: 'DIGITAL_MKT_2024', title: 'Digital Marketing Mastery', modules: ['Marketing Strategy', 'Social Media Marketing', 'Paid Advertising', 'SEO &amp; Content']},
  '4-cybersecurity-pdpa': {id: 'CYBERSEC_PDPA_2024', title: 'Cybersecurity &amp; PDPA Compliance', modules: ['Cybersecurity Basics', 'PDPA &amp; Data Protection', 'Data Governance', 'Compliance &amp; Best Practices']},
  '5-financial-literacy': {id: 'FIN_LIT_2024', title: 'Financial Literacy &amp; Investment', modules: ['Financial Fundamentals', 'Investment Basics', 'Stock Market &amp; Crypto', 'Retirement &amp; Wealth']},
  '6-ai-software-innovator': {id: 'AI_SW_INNOV_2024', title: 'AI Software Innovator', modules: ['AI Development Basics', 'Deep Learning', 'NLP &amp; LLMs', 'AI Applications']}
};

Object.keys(manifests).forEach(courseId => {
  const m = manifests[courseId];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${m.id}" version="1.0" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3">
<metadata><schema>ADL SCORM</schema><schemaversion>2004 4th Edition</schemaversion></metadata>
<organizations default="ORG">
<organization identifier="ORG"><title>${m.title}</title>
${m.modules.map((mod, i) => `<item identifier="M${i+1}" identifierref="R${i+1}"><title>Module ${i+1}: ${mod}</title></item>`).join('\n')}
<item identifier="Q" identifierref="RQ"><title>แบบทดสอบ</title></item>
</organization>
</organizations>
<resources>
${m.modules.map((_, i) => `<resource identifier="R${i+1}" type="webcontent" adlcp:scormType="sco" href="module${i+1}.html"><file href="module${i+1}.html"/><file href="shared/style.css"/><file href="shared/scorm.js"/></resource>`).join('\n')}
<resource identifier="RQ" type="webcontent" adlcp:scormType="sco" href="quiz.html"><file href="quiz.html"/><file href="shared/style.css"/><file href="shared/scorm.js"/><file href="shared/quiz.js"/></resource>
</resources>
</manifest>`;
  
  fs.writeFileSync(path.join('c:\\API\\The-SkillNexus\\scorm-courses', courseId, 'imsmanifest.xml'), xml);
  console.log(`✅ Created manifest for ${courseId}`);
});

console.log('🎉 All manifests created!');
