const XLSX = require('xlsx')
const path = require('path')

// Create sample data for chatbot Q&A
const data = [
  ['คำถาม (Question)', 'คำตอบ (Answer)', 'หมวดหมู่ (Category)'],
  ['SkillNexus LMS คืออะไร?', 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player, SCORM Support, AI Recommendations และ PWA ที่ช่วยให้การเรียนรู้มีประสิทธิภาพมากขึ้น', 'skillnexus'],
  ['ฟีเจอร์ Anti-Skip Video Player ทำงานอย่างไร?', 'Anti-Skip Video Player เป็นฟีเจอร์ที่ป้องกันผู้เรียนข้ามเนื้อหาวิดีโอ เพื่อให้มั่นใจว่าผู้เรียนรับชมเนื้อหาครบถ้วนตามหลักสูตร ระบบจะล็อกปุ่มข้ามและสไลเดอร์จนกว่าจะดูจบ', 'features'],
  ['ระบบรองรับ SCORM หรือไม่?', 'ใช่ ระบบรองรับมาตรฐาน SCORM (SCORM 1.2 และ SCORM 2004) ทำให้สามารถนำเข้าคอนเทนต์ eLearning จากเครื่องมือภายนอกได้ เช่น Articulate Storyline, iSpring และติดตามความคืบหน้าได้อย่างแม่นยำ', 'features'],
  ['PWA คืออะไร?', 'PWA (Progressive Web App) ทำให้ SkillNexus ทำงานเหมือนแอปมือถือ สามารถติดตั้งบนหน้าจอหลัก ใช้งานออฟไลน์ได้บางส่วน และอัปเดตอัตโนมัติ', 'technology'],
  ['ระบบ AI ช่วยอะไรได้บ้าง?', 'ระบบ AI ใน SkillNexus ช่วยแนะนำหลักสูตรที่เหมาะสม วิเคราะห์ความคืบหน้าการเรียน และสร้างเส้นทางการเรียนรู้ที่เหมาะกับแต่ละบุคคล', 'ai'],
  ['สามารถใช้งานบนมือถือได้หรือไม่?', 'ได้ครับ SkillNexus ออกแบบแบบ Mobile-First 100% Responsive รองรับการใช้งานบนทุกอุปกรณ์ ทั้งสมาร์ทโฟน แท็บเล็ต และเดสก์ทอป', 'mobile'],
  ['มีระบบใบประกาศนียบัตรหรือไม่?', 'มีครับ ระบบออกใบประกาศนียบัตรที่ได้รับการรับรองอุตสาหกรรม มีระบบ Blockchain verification เพื่อความน่าเชื่อถือ', 'certificates']
]

// Create workbook and worksheet
const wb = XLSX.utils.book_new()
const ws = XLSX.utils.aoa_to_sheet(data)

// Set column widths
ws['!cols'] = [
  { wch: 40 }, // Question column
  { wch: 80 }, // Answer column  
  { wch: 15 }  // Category column
]

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Chatbot Q&A')

// Write file
const outputPath = path.join(__dirname, '..', 'public', 'chatbot-template.xlsx')
XLSX.writeFile(wb, outputPath)

console.log('✅ Chatbot template created:', outputPath)