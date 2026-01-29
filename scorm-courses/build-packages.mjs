import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const baseDir = 'C:/API/The-SkillNexus/scorm-courses';

const courses = [
  { id: 'ai-chatgpt', name: 'AI & ChatGPT for Business', modules: 4 },
  { id: 'data-analytics', name: 'Data Analytics & BI', modules: 4 },
  { id: 'digital-marketing', name: 'Digital Marketing', modules: 4 },
  { id: 'cybersecurity', name: 'Cybersecurity & PDPA', modules: 4 },
  { id: 'financial-literacy', name: 'Financial Literacy', modules: 4 }
];

courses.forEach(course => {
  const courseDir = path.join(baseDir, course.id);
  fs.mkdirSync(courseDir, { recursive: true });
  fs.mkdirSync(path.join(courseDir, 'shared'), { recursive: true });
  
  for (let i = 1; i <= course.modules; i++) {
    fs.mkdirSync(path.join(courseDir, `module${i}`), { recursive: true });
  }
  
  console.log(`Created: ${course.name}`);
});
