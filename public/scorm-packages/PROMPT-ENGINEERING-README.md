# 🎓 Prompt Engineering SCORM Package

## 📦 รายละเอียด Package

**ชื่อคอร์ส:** Prompt Engineering: Master AI Communication  
**เวอร์ชัน:** SCORM 2004 4th Edition  
**ภาษา:** ไทย  
**ระยะเวลา:** ~30 นาที  

## 📚 เนื้อหาบทเรียน

### Lesson 1: Introduction to Prompt Engineering
- Prompt Engineering คืออะไร
- ทำไมต้องเรียน
- องค์ประกอบของ Prompt ที่ดี
- ตัวอย่าง Prompt ที่ดี vs ไม่ดี

### Lesson 2: Basic Prompt Techniques
- Zero-Shot Prompting
- Few-Shot Prompting
- Chain-of-Thought (CoT)
- แบบฝึกหัดเขียน Prompt

### Lesson 3: Advanced Strategies
- Role Prompting
- Constraint Prompting
- Iterative Refinement
- Template Prompting
- Best Practices

### Lesson 4: Interactive Quiz
- แบบทดสอบ 5 ข้อ
- ตรวจคำตอบอัตโนมัติ
- แสดงคะแนนและ Feedback

## 🚀 วิธีนำเข้า LMS

### 1. ดาวน์โหลดไฟล์
```
prompt-engineering-scorm.zip
```

### 2. นำเข้าใน SkillNexus LMS

#### ผ่าน Admin Dashboard:
1. ไปที่ `/dashboard/admin`
2. เลือก "Courses" → "Create Course"
3. กรอกข้อมูลคอร์ส:
   - Title: "Prompt Engineering"
   - Description: "เรียนรู้ศิลปะการสื่อสารกับ AI"
4. เลือก "Add Lesson" → "SCORM Package"
5. อัพโหลด `prompt-engineering-scorm.zip`
6. คลิก "Save"

#### ผ่าน API:
```bash
curl -X POST http://localhost:3000/api/scorm/upload \
  -F "file=@prompt-engineering-scorm.zip" \
  -F "courseId=YOUR_COURSE_ID"
```

### 3. ทดสอบ
1. ไปที่หน้าคอร์ส
2. คลิก "Start Learning"
3. ระบบจะเปิด SCORM Player
4. เรียนจบทุกบทเรียน
5. ทำแบบทดสอบ
6. ตรวจสอบคะแนนใน Dashboard

## ✨ Features

### Interactive Elements:
- ✅ แบบฝึกหัดเขียน Prompt
- ✅ แบบทดสอบ 5 ข้อ
- ✅ Feedback แบบ Real-time
- ✅ Progress Tracking

### SCORM 2004 Support:
- ✅ Completion Status
- ✅ Success Status
- ✅ Score Tracking (0-100)
- ✅ Time Tracking
- ✅ Suspend Data

### Responsive Design:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 📊 การให้คะแนน

- **ผ่าน:** 70% ขึ้นไป
- **ไม่ผ่าน:** ต่ำกว่า 70%

### เกณฑ์การประเมิน:
- 80-100%: ยอดเยี่ยม 🌟
- 60-79%: ดีมาก 👍
- 0-59%: ควรทบทวน 📚

## 🔧 Technical Details

### File Structure:
```
prompt-engineering-scorm/
├── imsmanifest.xml          # SCORM manifest
├── lesson1.html             # Introduction
├── lesson2.html             # Basic Techniques
├── lesson3.html             # Advanced Strategies
├── quiz.html                # Interactive Quiz
├── shared/
│   └── scorm2004.js        # SCORM API wrapper
└── res/
    └── style.css           # Styles
```

### Browser Support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### ปัญหา: SCORM ไม่บันทึกคะแนน
**แก้ไข:** ตรวจสอบว่า LMS รองรับ SCORM 2004

### ปัญหา: ไม่สามารถอัพโหลดได้
**แก้ไข:** ตรวจสอบขนาดไฟล์ (ต้องไม่เกิน 50MB)

### ปัญหา: แบบทดสอบไม่ทำงาน
**แก้ไข:** เปิด Browser Console ดู error

## 📝 License

MIT License - ใช้งานได้ฟรี

## 👨‍💻 Support

หากมีปัญหาติดต่อ: support@uppowerskill.com
