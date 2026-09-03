# 📦 SCORM Package: Prompt Engineering for Architects

## 🎯 คำอธิบาย
SCORM 1.2 Package สำหรับฝึกเขียน AI Prompts แบบ Interactive

## 📁 ไฟล์ในแพ็คเกจ
- `imsmanifest.xml` - SCORM manifest file
- `index.html` - หน้าเว็บหลัก (AI Chat Interface)
- `scorm_functions.js` - SCORM API functions

## 🚀 วิธีใช้งาน

### 1. สร้าง ZIP File
```bash
# เข้าไปในโฟลเดอร์
cd scorm-packages/prompt-engineering

# เลือกไฟล์ทั้ง 3 ไฟล์
# - imsmanifest.xml
# - index.html
# - scorm_functions.js

# คลิกขวา > Send to > Compressed (zipped) folder
# หรือใช้คำสั่ง
powershell Compress-Archive -Path * -DestinationPath ../prompt-engineering.zip
```

### 2. Upload ไป LMS
- เข้า LMS ของคุณ (Moodle, Canvas, etc.)
- เลือก "Add SCORM Package"
- Upload ไฟล์ `prompt-engineering.zip`
- ตั้งค่า Passing Score = 70%

## ✨ Features
- ✅ SCORM 1.2 Compliant
- ✅ Real-time Score Tracking
- ✅ Interactive AI Chat Interface
- ✅ Keyword Detection (Role, Context, Format)
- ✅ Beautiful UI with Animations
- ✅ Mobile Responsive

## 🎮 การให้คะแนน
- **100 คะแนน**: พบ 3+ keywords (Role, Context, Format)
- **70 คะแนน**: พบ 1-2 keywords
- **50 คะแนน**: ไม่พบ keywords

## 📊 SCORM Data Tracking
- `cmi.core.score.raw` - คะแนนที่ได้
- `cmi.core.lesson_status` - สถานะ (completed/incomplete)
- `cmi.core.score.min` - 0
- `cmi.core.score.max` - 100

## 🎨 Customization
แก้ไขได้ใน `index.html`:
- เปลี่ยนสี: แก้ CSS variables
- เพิ่ม keywords: แก้ array `keywords`
- ปรับเกณฑ์คะแนน: แก้ logic ใน `submitPrompt()`

## 📝 License
MIT License - ใช้งานได้ฟรี
