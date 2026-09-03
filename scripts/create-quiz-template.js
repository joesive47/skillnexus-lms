const XLSX = require('xlsx');
const path = require('path');

// Sample quiz data with better examples
const quizData = [
  {
    QuestionText: 'JavaScript ย่อมาจากอะไร?',
    OptionA: 'Just Another Very Awesome Script',
    OptionB: 'A scripting language for web development',
    OptionC: 'Java Standard',
    OptionD: 'None of the above',
    CorrectOption: 'B'
  },
  {
    QuestionText: 'ข้อใดคือ Data Type ใน JavaScript?',
    OptionA: 'String',
    OptionB: 'Number',
    OptionC: 'Boolean',
    OptionD: 'ถูกทุกข้อ',
    CorrectOption: 'D'
  },
  {
    QuestionText: 'คำสั่งใดใช้แสดงผลใน Console?',
    OptionA: 'console.log()',
    OptionB: 'print()',
    OptionC: 'echo()',
    OptionD: 'display()',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'ตัวแปรใน JavaScript ประกาศด้วยคำสั่งใด?',
    OptionA: 'var, let, const',
    OptionB: 'int, float, string',
    OptionC: 'variable, data, value',
    OptionD: 'declare, define, set',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Array ใน JavaScript เริ่มต้นที่ index เท่าไหร่?',
    OptionA: '1',
    OptionB: '0',
    OptionC: '-1',
    OptionD: 'ขึ้นอยู่กับตัวแปร',
    CorrectOption: 'B'
  },
  {
    QuestionText: 'Function ใน JavaScript ประกาศอย่างไร?',
    OptionA: 'function myFunc() {}',
    OptionB: 'def myFunc() {}',
    OptionC: 'void myFunc() {}',
    OptionD: 'func myFunc() {}',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'ข้อใดคือ Loop ใน JavaScript?',
    OptionA: 'for',
    OptionB: 'while',
    OptionC: 'do-while',
    OptionD: 'ถูกทุกข้อ',
    CorrectOption: 'D'
  },
  {
    QuestionText: 'Object ใน JavaScript สร้างด้วยเครื่องหมายอะไร?',
    OptionA: '[]',
    OptionB: '{}',
    OptionC: '()',
    OptionD: '<>',
    CorrectOption: 'B'
  },
  {
    QuestionText: 'Promise ใน JavaScript ใช้ทำอะไร?',
    OptionA: 'Asynchronous programming',
    OptionB: 'Create variables',
    OptionC: 'Define functions',
    OptionD: 'Loop through arrays',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Event Listener ใช้คำสั่งใด?',
    OptionA: 'addEventListener()',
    OptionB: 'addEvent()',
    OptionC: 'listen()',
    OptionD: 'on()',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'HTML ย่อมาจากอะไร?',
    OptionA: 'Hypertext Markup Language',
    OptionB: 'High Text Markup Language',
    OptionC: 'Hyper Transfer Markup Language',
    OptionD: 'Home Tool Markup Language',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'CSS ใช้ทำอะไร?',
    OptionA: 'จัดรูปแบบหน้าเว็บ',
    OptionB: 'เขียนโปรแกรม',
    OptionC: 'จัดการฐานข้อมูล',
    OptionD: 'สร้าง API',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Tag ใดใช้สร้างลิงก์?',
    OptionA: '<a>',
    OptionB: '<link>',
    OptionC: '<url>',
    OptionD: '<href>',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Tag ใดใช้แสดงรูปภาพ?',
    OptionA: '<img>',
    OptionB: '<image>',
    OptionC: '<picture>',
    OptionD: '<photo>',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Responsive Design ใช้ Media Query อย่างไร?',
    OptionA: '@media screen and (max-width: 768px)',
    OptionB: '@responsive (max-width: 768px)',
    OptionC: '@screen (max-width: 768px)',
    OptionD: '@device (max-width: 768px)',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Flexbox ใช้ display เป็นอะไร?',
    OptionA: 'flex',
    OptionB: 'flexbox',
    OptionC: 'flexible',
    OptionD: 'flex-box',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Grid Layout ใช้ property ใดกำหนดคอลัมน์?',
    OptionA: 'grid-template-columns',
    OptionB: 'columns',
    OptionC: 'grid-columns',
    OptionD: 'template-columns',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Position: absolute จะอ้างอิงกับอะไร?',
    OptionA: 'Parent ที่มี position: relative',
    OptionB: 'Window',
    OptionC: 'Body',
    OptionD: 'Document',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'z-index ใช้ทำอะไร?',
    OptionA: 'กำหนดลำดับชั้น',
    OptionB: 'กำหนดความกว้าง',
    OptionC: 'กำหนดความสูง',
    OptionD: 'กำหนดสี',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Pseudo-class :hover ใช้ทำอะไร?',
    OptionA: 'เปลี่ยนสไตล์เมื่อชี้เมาส์',
    OptionB: 'เปลี่ยนสีพื้นหลัง',
    OptionC: 'เปลี่ยนขนาดตัวอักษร',
    OptionD: 'ซ่อนองค์ประกอบ',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'React คืออะไร?',
    OptionA: 'JavaScript Library สำหรับสร้าง UI',
    OptionB: 'ภาษาโปรแกรมมิ่ง',
    OptionC: 'ฐานข้อมูล',
    OptionD: 'Web Server',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Component ใน React คืออะไร?',
    OptionA: 'Building block ของ UI',
    OptionB: 'ฐานข้อมูล',
    OptionC: 'API',
    OptionD: 'CSS Framework',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'useState Hook ใช้ทำอะไร?',
    OptionA: 'จัดการ State',
    OptionB: 'เรียก API',
    OptionC: 'สร้าง Component',
    OptionD: 'จัดการ Style',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'useEffect Hook ใช้ทำอะไร?',
    OptionA: 'จัดการ Side Effects',
    OptionB: 'สร้างตัวแปร',
    OptionC: 'ลบข้อมูล',
    OptionD: 'ตรวจสอบ Error',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Props ใน React คืออะไร?',
    OptionA: 'ข้อมูลที่ส่งระหว่าง Component',
    OptionB: 'CSS Properties',
    OptionC: 'JavaScript Properties',
    OptionD: 'HTML Attributes',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Virtual DOM ใน React คืออะไร?',
    OptionA: 'สำเนาของ Real DOM ในหน่วยความจำ',
    OptionB: 'Database',
    OptionC: 'API',
    OptionD: 'Web Server',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'JSX คืออะไร?',
    OptionA: 'JavaScript XML',
    OptionB: 'Java Syntax Extension',
    OptionC: 'JSON XML',
    OptionD: 'JavaScript Extension',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Key prop ใน React ใช้ทำไม?',
    OptionA: 'ระบุ unique ID ใน list',
    OptionB: 'เข้ารหัสข้อมูล',
    OptionC: 'เปิดล็อค Component',
    OptionD: 'จัดเรียงข้อมูล',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'Context API ใช้ทำอะไร?',
    OptionA: 'แชร์ข้อมูลข้าม Component',
    OptionB: 'สร้าง API',
    OptionC: 'จัดการ Database',
    OptionD: 'เรียก HTTP Request',
    CorrectOption: 'A'
  },
  {
    QuestionText: 'React Router ใช้ทำอะไร?',
    OptionA: 'จัดการ Navigation',
    OptionB: 'จัดการ State',
    OptionC: 'จัดการ Style',
    OptionD: 'จัดการ Database',
    CorrectOption: 'A'
  }
];

// Create workbook
const wb = XLSX.utils.book_new();

// Create worksheet
const ws = XLSX.utils.json_to_sheet(quizData);

// Set column widths
ws['!cols'] = [
  { wch: 60 }, // QuestionText
  { wch: 40 }, // OptionA
  { wch: 40 }, // OptionB
  { wch: 40 }, // OptionC
  { wch: 40 }, // OptionD
  { wch: 15 }  // CorrectOption
];

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Quiz Questions');

// Write to file
const outputPath = path.join(__dirname, '..', 'public', 'quiz-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Quiz template created successfully!');
console.log(`📁 Location: ${outputPath}`);
console.log(`📊 Total questions: ${quizData.length}`);
console.log('\n💡 Example usage:');
console.log('   - Import all 30 questions (set "จำนวนข้อที่จะให้ทำ" = 30)');
console.log('   - Or show only 20 random questions (set "จำนวนข้อที่จะให้ทำ" = 20)');
