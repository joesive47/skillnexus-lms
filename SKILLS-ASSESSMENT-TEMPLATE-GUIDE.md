# 📊 Skills Assessment Template Guide

## ✅ ไฟล์ Template ที่ถูกต้อง

### 📥 ดาวน์โหลด Template:
- **Excel**: `/skills-assessment-template-new.xlsx`
- **CSV**: `/skills-assessment-template-new.csv`

## 📋 โครงสร้างคอลัมน์ (English Headers)

### คอลัมน์หลัก (Required):

| Column Name | Type | Example | Description |
|------------|------|---------|-------------|
| `question_id` | Text | Q001 | รหัสคำถาม (ไม่ซ้ำ) |
| `career_title` | Text | Full Stack Developer | ชื่อสาขาอาชีพ |
| `skill_name` | Text | JavaScript | ทักษะที่ประเมิน |
| `question_text` | Text | What is a closure? | คำถาม (ภาษาไทยหรืออังกฤษ) |
| `option_1` | Text | A function... | ตัวเลือกที่ 1 |
| `option_2` | Text | A loop... | ตัวเลือกที่ 2 |
| `option_3` | Text | A data type... | ตัวเลือกที่ 3 |
| `option_4` | Text | An operator... | ตัวเลือกที่ 4 |
| `correct_answer` | Number | 1 | **คำตอบที่ถูก (1-4)** |
| `score` | Number | 5 | คะแนน (1-10) |
| `difficulty_level` | Text | Intermediate | Beginner/Intermediate/Advanced |

## ⚠️ สิ่งสำคัญ: correct_answer

### ✅ ถูกต้อง:
```
correct_answer: 1    (ตัวเลข 1-4)
correct_answer: 2
correct_answer: 3
correct_answer: 4
```

### ❌ ผิด:
```
correct_answer: option1          (ห้ามใช้ข้อความ)
correct_answer: A function...    (ห้ามใช้คำตอบเต็ม)
correct_answer: ตัวเลือก 1       (ห้ามใช้ภาษาไทย)
```

## 📝 ตัวอย่างข้อมูลที่ถูกต้อง

### Row 1: JavaScript Question
```csv
Q001,Full Stack Developer,JavaScript,What is a closure in JavaScript?,A function that has access to variables in its outer scope,A loop structure for iterating arrays,A data type for storing objects,An operator for comparing values,1,5,Intermediate
```

**อธิบาย:**
- `question_id`: Q001
- `career_title`: Full Stack Developer
- `skill_name`: JavaScript
- `question_text`: What is a closure in JavaScript?
- `option_1`: A function that has access to variables in its outer scope ✅ (คำตอบที่ถูก)
- `option_2`: A loop structure for iterating arrays
- `option_3`: A data type for storing objects
- `option_4`: An operator for comparing values
- `correct_answer`: **1** (ชี้ไปที่ option_1)
- `score`: 5
- `difficulty_level`: Intermediate

### Row 2: React Question
```csv
Q002,Full Stack Developer,React,Which React Hook is used for side effects?,useState,useEffect,useContext,useReducer,2,5,Intermediate
```

**อธิบาย:**
- `correct_answer`: **2** (ชี้ไปที่ option_2: useEffect) ✅

### Row 3: Node.js Question
```csv
Q003,Full Stack Developer,Node.js,What is the correct way to handle errors in async/await?,Using .catch() method,Using try-catch block,Using callback functions,Using Promise.reject(),2,5,Advanced
```

**อธิบาย:**
- `correct_answer`: **2** (ชี้ไปที่ option_2: Using try-catch block) ✅

## 🎯 ตัวอย่างภาษาไทย

```csv
Q006,นักพัฒนาเว็บ,HTML,แท็ก HTML ใดใช้สำหรับสร้างลิงก์?,<a>,<link>,<href>,<url>,1,3,Beginner
```

**อธิบาย:**
- คำถามและตัวเลือกเป็นภาษาไทยได้
- แต่ `correct_answer` ต้องเป็นตัวเลข **1** เท่านั้น!

## 📊 การแปลงคำตอบ

### ระบบจะแปลงอัตโนมัติ:

| correct_answer | แปลงเป็น | ใช้เช็คกับ |
|----------------|----------|-----------|
| 1 | option1 | ตัวเลือกที่ 1 |
| 2 | option2 | ตัวเลือกที่ 2 |
| 3 | option3 | ตัวเลือกที่ 3 |
| 4 | option4 | ตัวเลือกที่ 4 |

## ✅ Checklist ก่อน Import

- [ ] ชื่อคอลัมน์เป็นภาษาอังกฤษ (English Headers)
- [ ] `correct_answer` เป็นตัวเลข 1-4 เท่านั้น
- [ ] ทุกคำถามมี 4 ตัวเลือก
- [ ] `difficulty_level` เป็น Beginner, Intermediate, หรือ Advanced
- [ ] `score` เป็นตัวเลข 1-10
- [ ] ไม่มีแถวว่าง
- [ ] ไฟล์เป็น .xlsx หรือ .csv

## 🚀 วิธีใช้งาน

### 1. ดาวน์โหลด Template
```
คลิก "Excel Template" หรือ "CSV Template" ในหน้า Admin
```

### 2. กรอกข้อมูล
```
- เปิดไฟล์ด้วย Excel หรือ Google Sheets
- กรอกข้อมูลตามตัวอย่าง
- ตรวจสอบ correct_answer เป็นตัวเลข 1-4
```

### 3. บันทึกไฟล์
```
- Excel: บันทึกเป็น .xlsx
- CSV: บันทึกเป็น .csv (UTF-8)
```

### 4. Import
```
- คลิก "Import File" ในหน้า Admin
- เลือกไฟล์ที่บันทึก
- ตรวจสอบผลการ Import
```

## 🎨 ตัวอย่างครบชุด (5 คำถาม)

```csv
question_id,career_title,skill_name,question_text,option_1,option_2,option_3,option_4,correct_answer,score,difficulty_level
Q001,Full Stack Developer,JavaScript,What is a closure in JavaScript?,A function that has access to variables in its outer scope,A loop structure for iterating arrays,A data type for storing objects,An operator for comparing values,1,5,Intermediate
Q002,Full Stack Developer,React,Which React Hook is used for side effects?,useState,useEffect,useContext,useReducer,2,5,Intermediate
Q003,Full Stack Developer,Node.js,What is the correct way to handle errors in async/await?,Using .catch() method,Using try-catch block,Using callback functions,Using Promise.reject(),2,5,Advanced
Q004,Full Stack Developer,Database Design,Which SQL JOIN returns all records from both tables?,INNER JOIN,LEFT JOIN,RIGHT JOIN,FULL OUTER JOIN,4,5,Intermediate
Q005,Full Stack Developer,Git,What Git command is used to combine branches?,git combine,git merge,git join,git unite,2,3,Beginner
```

## 🔍 การตรวจสอบหลัง Import

### ในหน้า Admin จะแสดง:
- ✅ คำตอบที่ถูกจะมีสีเขียว + ✓
- ✅ แสดง "คำตอบที่ถูก: ข้อ X"
- ✅ จำนวนคำถามที่ Import สำเร็จ

### ตัวอย่างการแสดงผล:
```
1. A function that has access... ✓ คำตอบที่ถูก [สีเขียว]
2. A loop structure...          [สีเทา]
3. A data type...               [สีเทา]
4. An operator...               [สีเทา]

คำตอบที่ถูก: ข้อ 1
```

## ❓ FAQ

### Q: ทำไมต้องใช้ตัวเลข 1-4?
A: เพื่อให้ระบบเช็คคำตอบได้ถูกต้อง ไม่ขึ้นกับภาษาหรือข้อความ

### Q: ใช้ภาษาไทยได้ไหม?
A: ได้! แต่เฉพาะคำถามและตัวเลือก ส่วน correct_answer ต้องเป็นตัวเลข

### Q: ถ้า Import ผิดพลาดจะเกิดอะไร?
A: ระบบจะแจ้งเตือนและไม่ Import ข้อมูลที่ผิด

### Q: แก้ไขข้อมูลหลัง Import ได้ไหม?
A: ได้ ไปที่หน้ารายละเอียดการประเมินแล้วแก้ไขทีละคำถาม

## 📞 ต้องการความช่วยเหลือ?

หากพบปัญหาหรือมีคำถาม:
1. ตรวจสอบ Checklist ด้านบน
2. ดูตัวอย่างข้อมูลที่ถูกต้อง
3. ลองใช้ Template ที่ให้มา

---

**สร้างโดย:** SkillNexus Team  
**อัพเดทล่าสุด:** 2025-01-08  
**เวอร์ชัน:** 2.0 (Fixed correct_answer format)
