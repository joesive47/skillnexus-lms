import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// สร้าง template สำหรับ Skills Assessment
const template = [
  {
    question_id: 'Q001',
    career_title: 'Social Media Manager',
    skill_name: 'Content Creation',
    question_text: 'คุณใช้เครื่องมือใดในการออกแบบ?',
    option_1: 'Canva',
    option_2: 'Photoshop',
    option_3: 'Figma',
    option_4: 'Illustrator',
    correct_answer: '2,3,4',
    score: 5,
    course_link: 'https://example.com/course'
  },
  {
    question_id: 'Q002',
    career_title: 'Social Media Manager',
    skill_name: 'Analytics',
    question_text: 'เครื่องมือใดที่ใช้วิเคราะห์ Social Media?',
    option_1: 'Google Analytics',
    option_2: 'Facebook Insights',
    option_3: 'Hootsuite',
    option_4: 'Buffer',
    correct_answer: '1,2',
    score: 5,
    course_link: 'https://example.com/analytics-course'
  }
];

// สร้าง workbook
const ws = XLSX.utils.json_to_sheet(template);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Skills Assessment');

// บันทึกไฟล์
const outputPath = path.join(__dirname, '..', 'public', 'skills-assessment-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ สร้าง Skills Assessment Template สำเร็จ!');
console.log('📁 ไฟล์: public/skills-assessment-template.xlsx');
console.log('📋 คอลัมน์ที่จำเป็น:');
console.log('   - question_id');
console.log('   - career_title');
console.log('   - skill_name');
console.log('   - question_text');
console.log('   - option_1, option_2, option_3, option_4');
console.log('   - correct_answer (เช่น "1,2" สำหรับตัวเลือกที่ 1 และ 2)');
console.log('   - score');
console.log('   - course_link');