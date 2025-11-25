import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// สร้างข้อมูลตัวอย่าง
const sampleData = [
  {
    'คำถาม': 'เมืองหลวงของประเทศฝรั่งเศสคือเมืองใด?',
    'ตัวเลือก1': 'ลอนดอน',
    'ตัวเลือก2': 'เบอร์ลิน', 
    'ตัวเลือก3': 'ปารีส',
    'ตัวเลือก4': 'มาดริด',
    'คำตอบที่ถูกต้อง': '3',
    'คำอธิบาย': 'ปารีสเป็นเมืองหลวงและเมืองที่ใหญ่ที่สุดของประเทศฝรั่งเศส'
  },
  {
    'คำถาม': 'ภาษาโปรแกรมมิ่งใดที่นิยมใช้ในการพัฒนาเว็บไซต์?',
    'ตัวเลือก1': 'Python',
    'ตัวเลือก2': 'JavaScript',
    'ตัวเลือก3': 'C++', 
    'ตัวเลือก4': 'Java',
    'คำตอบที่ถูกต้อง': '2',
    'คำอธิบาย': 'JavaScript เป็นภาษาโปรแกรมมิ่งที่ใช้กันอย่างแพร่หลายในการพัฒนาเว็บไซต์ทั้งฝั่ง Frontend และ Backend'
  },
  {
    'คำถาม': 'HTML ย่อมาจากอะไร?',
    'ตัวเลือก1': 'Hyperlink Text Markup Language',
    'ตัวเลือก2': 'Home Tool Markup Language',
    'ตัวเลือก3': 'HyperText Markup Language',
    'ตัวเลือก4': 'Hyperlink and Text Markup Language', 
    'คำตอบที่ถูกต้อง': '3',
    'คำอธิบาย': 'HTML ย่อมาจาก HyperText Markup Language ซึ่งเป็นภาษามาร์กอัปมาตรฐานสำหรับสร้างเว็บเพจ'
  }
];

// สร้าง workbook
const wb = XLSX.utils.book_new();

// สร้าง worksheet จากข้อมูล
const ws = XLSX.utils.json_to_sheet(sampleData);

// เพิ่ม worksheet ลงใน workbook
XLSX.utils.book_append_sheet(wb, ws, 'Quiz Questions');

// บันทึกไฟล์
const outputPath = path.join(__dirname, '..', 'public', 'quiz-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('Excel template created successfully at:', outputPath);