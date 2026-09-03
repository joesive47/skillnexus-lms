# 🎯 SCORM Hosting Guide - Netlify (แนะนำ)

## ✅ วิธีที่ใช้งานได้จริง - Netlify

### ขั้นตอนที่ 1: Extract SCORM Package

```bash
# ไปที่ folder
cd C:\API\The-SkillNexus\scorm-packages\

# Extract ไฟล์ .zip
# คลิกขวา → Extract All
# หรือใช้ 7-Zip, WinRAR
```

จะได้ folder ที่มีไฟล์:
- `module1.html`, `module2.html`, etc.
- `imsmanifest.xml`
- `res/` (resources)
- `shared/`

---

### ขั้นตอนที่ 2: สมัคร Netlify (ฟรี)

1. ไปที่: https://app.netlify.com/signup
2. Sign up with GitHub (แนะนำ)
3. หรือใช้ Email

---

### ขั้นตอนที่ 3: Deploy SCORM

1. คลิก **Add new site** → **Deploy manually**
2. **Drag & Drop** folder ที่ extract แล้ว
3. รอ 10-30 วินาที
4. ✅ Deploy สำเร็จ!

---

### ขั้นตอนที่ 4: Copy URL

**ตัวอย่าง URL ที่ได้:**
```
https://dynamic-gumption-cd5cca.netlify.app/module1.html
```

**เปลี่ยนชื่อ Site (Optional):**
1. Site settings → Domain management
2. Change site name → `scorm-ai-architect`
3. ได้ URL ใหม่: `https://scorm-ai-architect.netlify.app/module1.html`

---

### ขั้นตอนที่ 5: ใช้ใน LMS

1. Login เป็น Teacher
2. Create Course → Add SCORM Lesson
3. **SCORM Package URL:**
   ```
   https://dynamic-gumption-cd5cca.netlify.app/module1.html
   ```
4. Title: "AI Architect Blueprint - Module 1"
5. Duration: 30 min
6. **Save**

---

## 📦 SCORM Packages ที่มีอยู่

### 1. AI Architect Blueprint
**Netlify URL:**
```
https://dynamic-gumption-cd5cca.netlify.app/module1.html
https://dynamic-gumption-cd5cca.netlify.app/module2.html
https://dynamic-gumption-cd5cca.netlify.app/module3.html
https://dynamic-gumption-cd5cca.netlify.app/module4.html
https://dynamic-gumption-cd5cca.netlify.app/assessment.html
```

**Modules:**
- Module 1: AI Fundamentals
- Module 2: Machine Learning Basics
- Module 3: Neural Networks
- Module 4: AI Architecture Design
- Assessment: Final Quiz

---

### 2. Prompt Engineering (ยังไม่ได้ deploy)

**ขั้นตอน:**
1. Extract `prompt-engineering.zip`
2. Deploy ไป Netlify
3. ได้ URL: `https://your-site.netlify.app/lesson1.html`

---

## ✨ ข้อดีของ Netlify

✅ **ฟรี** - ไม่มีค่าใช้จ่าย
✅ **ถาวร** - ลิงก์ไม่หมดอายุ
✅ **เร็ว** - CDN ทั่วโลก
✅ **HTTPS** - ปลอดภัย
✅ **ง่าย** - Drag & Drop
✅ **รองรับ SCORM** - 100%

---

## 🔄 อัปเดต SCORM Content

ถ้าต้องการแก้ไข SCORM:

1. แก้ไขไฟล์ใน folder
2. ไปที่ Netlify → Deploys
3. Drag & Drop folder ใหม่
4. URL เดิมยังใช้ได้

---

## 📝 Tips

1. **ตั้งชื่อ Site ให้จำง่าย:**
   - `scorm-ai-architect`
   - `scorm-prompt-engineering`

2. **แยก Site ตาม Course:**
   - 1 Course = 1 Netlify Site
   - จัดการง่าย

3. **Backup URL:**
   - บันทึก URL ไว้ใน README.md
   - หรือ Google Sheets

---

## 🆘 Troubleshooting

**ปัญหา: ไฟล์ไม่โหลด**
- ✅ ตรวจสอบว่า extract ครบทุกไฟล์
- ✅ ตรวจสอบว่ามี `index.html` หรือ `module1.html`

**ปัญหา: SCORM ไม่ทำงาน**
- ✅ ตรวจสอบว่ามี `imsmanifest.xml`
- ✅ ลอง URL อื่น เช่น `/module2.html`

**ปัญหา: Site หมดอายุ**
- ✅ ใช้ Netlify Account (ไม่ใช่ Drop)
- ✅ Site จะอยู่ถาวร

---

## 🎉 สรุป

**วิธีที่ดีที่สุดสำหรับ SCORM บน Vercel:**

1. Extract SCORM package
2. Deploy ไป Netlify (ฟรี)
3. Copy URL
4. ใส่ใน LMS
5. ✅ ใช้งานได้!

**ไม่ต้องใช้:**
- ❌ GitHub Pages (ยุ่งยาก)
- ❌ Google Drive (ไม่รองรับ)
- ❌ File upload (Vercel ไม่รองรับ)

**Netlify คือทางออกที่ดีที่สุด!** 🚀
