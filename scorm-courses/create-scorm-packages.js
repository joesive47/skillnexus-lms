const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const courses = [
  {
    id: '1-ai-chatgpt',
    title: 'AI & ChatGPT for Business',
    duration: 360,
    price: 3999
  },
  {
    id: '2-data-analytics',
    title: 'Data Analytics & Business Intelligence',
    duration: 420,
    price: 4499
  },
  {
    id: '3-digital-marketing',
    title: 'Digital Marketing Mastery',
    duration: 390,
    price: 3799
  },
  {
    id: '4-cybersecurity',
    title: 'Cybersecurity & PDPA Compliance',
    duration: 300,
    price: 2999
  },
  {
    id: '5-financial-literacy',
    title: 'Financial Literacy & Investment',
    duration: 330,
    price: 3299
  }
];

courses.forEach(course => {
  const dir = path.join(__dirname, course.id);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create subdirectories
  ['module1', 'module2', 'module3', 'module4', 'shared', 'assessment'].forEach(subdir => {
    const subdirPath = path.join(dir, subdir);
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath);
    }
  });
  
  console.log(`Created structure for ${course.title}`);
});

console.log('All course structures created!');
