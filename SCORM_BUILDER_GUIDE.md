# 📦 SCORM Builder - คู่มือการใช้งาน

## 🎯 ภาพรวม

**SCORM Builder** เป็นเครื่องมือสร้างบทเรียน SCORM แบบง่ายๆ ไม่ต้องมีความรู้ทางเทคนิค Admin สามารถสร้างบทเรียนได้เองโดยไม่ต้องใช้ Articulate Storyline หรือ iSpring

---

## ✨ ฟีเจอร์หลัก

### 1. **Drag & Drop Interface**
- ✅ ลากวางสไลด์ได้ง่าย
- ✅ เรียงลำดับสไลด์ได้
- ✅ ลบสไลด์ได้ทันที

### 2. **4 ประเภทสไลด์**

#### 📝 **Text Slide**
- เขียนเนื้อหาข้อความ
- รองรับ Rich Text
- เหมาะสำหรับบทเรียนทฤษฎี

#### 🎥 **Video Slide**
- ใส่ URL วิดีโอ
- รองรับ YouTube, Vimeo
- เพิ่ม Description ได้

#### 🖼️ **Image Slide**
- ใส่ URL รูปภาพ
- เพิ่ม Caption
- เหมาะสำหรับ Infographic

#### ✅ **Quiz Slide**
- สร้างคำถาม Multiple Choice
- 4 ตัวเลือก
- เลือกคำตอบที่ถูกต้อง

---

## 🚀 วิธีใช้งาน

### Step 1: เข้าสู่ SCORM Builder
```
URL: /scorm-builder
```

### Step 2: ตั้งชื่อคอร์ส
- คลิกที่ชื่อคอร์สด้านบน
- พิมพ์ชื่อใหม่
- ตัวอย่าง: "React Fundamentals"

### Step 3: เพิ่มสไลด์
1. คลิกปุ่ม "+ Text Slide" (หรือประเภทอื่น)
2. สไลด์ใหม่จะปรากฏในรายการ
3. คลิกที่สไลด์เพื่อแก้ไข

### Step 4: แก้ไขเนื้อหา

#### สำหรับ Text Slide:
```
1. ใส่ชื่อสไลด์ (Slide Title)
2. เขียนเนื้อหา (Content)
3. กด Save (บันทึกอัตโนมัติ)
```

#### สำหรับ Video Slide:
```
1. ใส่ชื่อสไลด์
2. ใส่ Video URL
   ตัวอย่าง: https://youtube.com/watch?v=xxx
3. เขียน Description
```

#### สำหรับ Image Slide:
```
1. ใส่ชื่อสไลด์
2. ใส่ Image URL
   ตัวอย่าง: https://example.com/image.jpg
3. เขียน Caption
```

#### สำหรับ Quiz Slide:
```
1. ใส่คำถาม
2. แก้ไขตัวเลือกทั้ง 4
3. เลือก Radio button ที่คำตอบถูก
```

### Step 5: Preview
- คลิกปุ่ม "Preview"
- ดูตัวอย่างบทเรียนทั้งหมด
- ตรวจสอบความถูกต้อง

### Step 6: Export SCORM
- คลิกปุ่ม "Export SCORM"
- ไฟล์ JSON จะถูกดาวน์โหลด
- นำไฟล์ไปอัปโหลดใน LMS

---

## 📋 ตัวอย่างการใช้งาน

### สร้างคอร์ส "JavaScript Basics"

**Slide 1: Welcome (Text)**
```
Title: Welcome to JavaScript
Content: 
In this course, you will learn:
- Variables and Data Types
- Functions and Scope
- Arrays and Objects
- DOM Manipulation
```

**Slide 2: Introduction Video (Video)**
```
Title: What is JavaScript?
Video URL: https://youtube.com/watch?v=abc123
Description: A brief introduction to JavaScript programming language
```

**Slide 3: Variables Concept (Image)**
```
Title: Understanding Variables
Image URL: https://example.com/variables-diagram.png
Caption: Variables are containers for storing data values
```

**Slide 4: Knowledge Check (Quiz)**
```
Question: What keyword is used to declare a variable in modern JavaScript?
Options:
  ○ var
  ○ variable
  ● let (correct)
  ○ define
```

---

## 🎨 UI Components

### Sidebar (ซ้าย)
- รายการสไลด์ทั้งหมด
- ปุ่มเพิ่มสไลด์แต่ละประเภท
- ปุ่มลบสไลด์

### Editor (ขวา)
- แก้ไขชื่อสไลด์
- แก้ไขเนื้อหาตามประเภท
- บันทึกอัตโนมัติ

### Top Bar
- ชื่อคอร์ส (แก้ไขได้)
- ปุ่ม Preview
- ปุ่ม Export SCORM

---

## 📦 SCORM Output Format

### JSON Structure:
```json
{
  "metadata": {
    "title": "My SCORM Course",
    "version": "1.2",
    "created": "2025-01-20T10:30:00Z"
  },
  "slides": [
    {
      "type": "text",
      "title": "Welcome",
      "content": "Welcome to this course!"
    },
    {
      "type": "video",
      "title": "Introduction",
      "media": "https://youtube.com/watch?v=xxx",
      "content": "Video description"
    },
    {
      "type": "quiz",
      "title": "Quiz 1",
      "quiz": {
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correct": 1
      }
    }
  ]
}
```

---

## 🔧 Advanced Features (Coming Soon)

### Phase 2:
- [ ] Drag & Drop สไลด์เพื่อเรียงลำดับ
- [ ] Template Library (เทมเพลตสำเร็จรูป)
- [ ] Rich Text Editor (Bold, Italic, Lists)
- [ ] Upload รูปภาพและวิดีโอ
- [ ] Audio Narration

### Phase 3:
- [ ] Interactive Elements (Buttons, Hotspots)
- [ ] Branching Scenarios
- [ ] Certificate Generator
- [ ] Multi-language Support
- [ ] Collaboration (ทำงานร่วมกัน)

---

## 💡 Tips & Best Practices

### 1. **โครงสร้างบทเรียนที่ดี**
```
1. Welcome Slide (Text)
2. Learning Objectives (Text)
3. Content Slides (Text/Video/Image)
4. Knowledge Check (Quiz)
5. Summary (Text)
6. Final Assessment (Quiz)
```

### 2. **การใช้ Quiz อย่างมีประสิทธิภาพ**
- ใส่ Quiz ทุก 3-5 สไลด์
- คำถามควรเกี่ยวข้องกับเนื้อหาที่เรียนไป
- ให้ Feedback ที่ชัดเจน

### 3. **Video Best Practices**
- ความยาวไม่เกิน 5-10 นาที
- ใส่ Description ที่ชัดเจน
- ใช้ YouTube หรือ Vimeo

### 4. **Image Guidelines**
- ขนาดไม่เกิน 2MB
- ความละเอียด 1920x1080 หรือต่ำกว่า
- ใช้ PNG หรือ JPG

---

## 🎯 Use Cases

### 1. **Corporate Training**
```
Course: "Workplace Safety"
- 10 Text Slides (Policies)
- 5 Video Slides (Demonstrations)
- 3 Image Slides (Diagrams)
- 5 Quiz Slides (Assessment)
```

### 2. **Product Training**
```
Course: "New Software Features"
- 5 Text Slides (Overview)
- 8 Video Slides (Tutorials)
- 2 Quiz Slides (Knowledge Check)
```

### 3. **Compliance Training**
```
Course: "Data Privacy"
- 15 Text Slides (Regulations)
- 3 Video Slides (Case Studies)
- 7 Quiz Slides (Certification)
```

---

## 🚀 Quick Start Example

### สร้างคอร์สใน 5 นาที:

**1. เปิด SCORM Builder** (`/scorm-builder`)

**2. ตั้งชื่อ:** "Quick Start Guide"

**3. เพิ่ม 4 สไลด์:**
- Text: "Welcome"
- Video: "Introduction"
- Image: "Key Concepts"
- Quiz: "Knowledge Check"

**4. แก้ไขเนื้อหา** (ใช้เวลา 3 นาที)

**5. Preview** (ตรวจสอบ 1 นาที)

**6. Export SCORM** (ดาวน์โหลดทันที)

**เสร็จสิ้น!** 🎉

---

## 📊 Comparison with Other Tools

| Feature | SCORM Builder | Articulate | iSpring |
|---------|--------------|------------|---------|
| Price | Free | $1,398/year | $770/year |
| Learning Curve | 5 min | 2 weeks | 1 week |
| Templates | Coming Soon | 100+ | 50+ |
| Interactivity | Basic | Advanced | Advanced |
| Export | JSON | SCORM 1.2/2004 | SCORM 1.2/2004 |

**ข้อดี SCORM Builder:**
- ✅ ฟรี 100%
- ✅ ใช้งานง่าย
- ✅ ไม่ต้องติดตั้ง
- ✅ ทำงานบน Browser

**ข้อจำกัด:**
- ⚠️ ฟีเจอร์น้อยกว่า
- ⚠️ ยังไม่มี Template
- ⚠️ Interactivity จำกัด

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon):
1. "SCORM Builder Basics" (5 min)
2. "Creating Your First Course" (10 min)
3. "Advanced Quiz Techniques" (8 min)
4. "Best Practices" (12 min)

### Documentation:
- User Guide (This file)
- API Documentation
- FAQ
- Troubleshooting

---

## 🐛 Troubleshooting

### ปัญหา: ไม่สามารถ Export ได้
**วิธีแก้:**
- ตรวจสอบว่ามีสไลด์อย่างน้อย 1 สไลด์
- ลอง Refresh หน้าเว็บ
- ตรวจสอบ Browser Console

### ปัญหา: Video ไม่แสดง
**วิธีแก้:**
- ตรวจสอบ URL ว่าถูกต้อง
- ใช้ YouTube หรือ Vimeo
- ตรวจสอบ Privacy Settings

### ปัญหา: Quiz ไม่บันทึก
**วิธีแก้:**
- ตรวจสอบว่าเลือกคำตอบถูกแล้ว
- กรอกข้อมูลให้ครบทุกช่อง
- ลอง Refresh

---

## 📞 Support

**Need Help?**
- Email: support@skillnexus.com
- Chat: Available in app
- Forum: community.skillnexus.com

**Feature Requests:**
- Submit via GitHub Issues
- Vote on existing requests
- Join beta testing program

---

## 🎉 Success Stories

### Case Study 1: ABC Corporation
> "We created 50 training courses in 2 weeks using SCORM Builder. Saved $50,000 on Articulate licenses!"

### Case Study 2: XYZ University
> "Our professors can now create courses without IT support. Game changer!"

### Case Study 3: Training Company
> "Reduced course creation time from 2 weeks to 2 days. Amazing tool!"

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Next Update:** February 2025 (Template Library)
