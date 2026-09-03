# 🚀 SCORM Builder - สร้าง SCORM แบบ Static

## 🎯 วิธีใช้งาน

### 1. สร้าง SCORM Package

```bash
# รันสคริปต์สร้าง SCORM
node scripts/build-scorm-packages.mjs
```

ผลลัพธ์:
```
public/scorm-packages/
├── javascript-basics/
│   ├── imsmanifest.xml
│   ├── index.html
│   └── scorm_api.js
├── react-fundamentals/
│   ├── imsmanifest.xml
│   ├── index.html
│   └── scorm_api.js
└── python-basics/
    ├── imsmanifest.xml
    ├── index.html
    └── scorm_api.js
```

---

### 2. เพิ่ม SCORM Package ใหม่

แก้ไข `scripts/build-scorm-packages.mjs`:

```javascript
const packages = [
  {
    id: 'my-course',              // ชื่อ folder
    title: 'คอร์สของฉัน',          // ชื่อคอร์ส
    description: 'รายละเอียด',     // คำอธิบาย
    htmlContent: `
      <h2>เนื้อหาบทเรียน</h2>
      <p>เนื้อหาของคุณที่นี่...</p>
    `,
    passingScore: 80              // คะแนนผ่าน
  }
]
```

---

### 3. ใช้งานใน Database

```typescript
// สร้าง lesson ที่ชี้ไป SCORM package
await prisma.lesson.create({
  data: {
    title: 'JavaScript พื้นฐาน',
    courseId: 'xxx',
    type: 'SCORM',
    lessonType: 'SCORM',
    launchUrl: '/scorm-packages/javascript-basics/index.html',
    order: 1
  }
})
```

---

### 4. Deploy

```bash
# SCORM packages จะถูก deploy ไปกับโปรเจค
npm run build
vercel deploy
```

URL: `https://yourdomain.com/scorm-packages/javascript-basics/index.html`

---

## 📝 Template ตัวอย่าง

### Basic HTML Content
```javascript
{
  id: 'html-basics',
  title: 'HTML พื้นฐาน',
  htmlContent: `
    <h2>HTML Elements</h2>
    <ul>
      <li>Headings: h1, h2, h3</li>
      <li>Paragraphs: p</li>
      <li>Links: a</li>
    </ul>
  `
}
```

### With Video
```javascript
{
  id: 'video-lesson',
  title: 'บทเรียนวิดีโอ',
  htmlContent: `
    <video controls width="100%">
      <source src="/videos/lesson.mp4" type="video/mp4">
    </video>
    <p>เนื้อหาเพิ่มเติม...</p>
  `
}
```

### With Quiz
```javascript
{
  id: 'quiz-lesson',
  title: 'แบบทดสอบ',
  htmlContent: `
    <h2>คำถาม</h2>
    <form id="quiz">
      <p>1. JavaScript คืออะไร?</p>
      <label><input type="radio" name="q1" value="a"> ภาษาโปรแกรม</label><br>
      <label><input type="radio" name="q1" value="b"> ระบบปฏิบัติการ</label><br>
      <button type="submit">ส่งคำตอบ</button>
    </form>
    <script>
      document.getElementById('quiz').onsubmit = (e) => {
        e.preventDefault();
        const answer = document.querySelector('input[name="q1"]:checked').value;
        if (answer === 'a') {
          alert('ถูกต้อง!');
          window.API.LMSSetValue("cmi.core.score.raw", "100");
        }
      };
    </script>
  `
}
```

---

## 🎨 Customization

### เปลี่ยน Style

แก้ไข `src/lib/scorm-builder.ts` ในส่วน `<style>`:

```css
body { 
  background: #f3f4f6; 
  font-family: 'Prompt', sans-serif; 
}
h1 { color: #3b82f6; }
```

### เพิ่ม JavaScript

เพิ่มใน `htmlContent`:

```javascript
htmlContent: `
  <div id="app"></div>
  <script>
    // Your custom JavaScript
    document.getElementById('app').innerHTML = 'Hello!';
  </script>
`
```

---

## 📊 SCORM Tracking

### ข้อมูลที่ติดตาม:
- `cmi.core.lesson_status` - สถานะ (incomplete/completed)
- `cmi.core.score.raw` - คะแนน (0-100)
- `cmi.core.session_time` - เวลาเรียน
- `cmi.core.lesson_location` - ตำแหน่งล่าสุด

### ตัวอย่างการใช้งาน:
```javascript
// เริ่มต้น
API.LMSInitialize("");

// บันทึกคะแนน
API.LMSSetValue("cmi.core.score.raw", "85");

// เสร็จสิ้น
API.LMSSetValue("cmi.core.lesson_status", "completed");
API.LMSCommit("");
```

---

## 🔧 Advanced: สร้างแบบ Dynamic

```typescript
import { scormBuilder } from '@/lib/scorm-builder'

// ใน API route
export async function POST(req: Request) {
  const { title, content } = await req.json()
  
  const path = await scormBuilder.createPackage(
    `course-${Date.now()}`,
    {
      title,
      htmlContent: content,
      passingScore: 80
    }
  )
  
  return Response.json({ path })
}
```

---

## ✅ Checklist

- [ ] รัน `node scripts/build-scorm-packages.mjs`
- [ ] ตรวจสอบ `public/scorm-packages/`
- [ ] สร้าง lesson ใน database
- [ ] ทดสอบเปิด SCORM ใน browser
- [ ] Deploy to production
- [ ] ทดสอบ tracking

---

## 🎉 ข้อดี

✅ **Static** - ไม่ต้อง upload, deploy ไปกับโปรเจค  
✅ **Fast** - โหลดเร็ว, ไม่ต้องประมวลผล  
✅ **Simple** - แก้ไขง่าย, version control ได้  
✅ **Free** - ไม่มีค่า storage เพิ่ม  
✅ **Portable** - ย้ายไปไหนก็ได้  

---

**🚀 พร้อมใช้งานแล้ว! Deploy ได้เลย!**
