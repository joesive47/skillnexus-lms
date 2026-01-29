# 🚀 SCORM Builder - Quick Start

## ใช้งาน 3 ขั้นตอน

### 1️⃣ สร้าง SCORM Packages
```bash
npm run scorm:build
```

### 2️⃣ ตรวจสอบผลลัพธ์
```
public/scorm-packages/
├── javascript-basics/
├── react-fundamentals/
└── python-basics/
```

### 3️⃣ Deploy
```bash
npm run build
vercel deploy
```

---

## 🎯 เพิ่ม SCORM ใหม่

แก้ไข `scripts/build-scorm-packages.mjs`:

```javascript
const packages = [
  {
    id: 'my-new-course',
    title: 'คอร์สใหม่ของฉัน',
    description: 'รายละเอียดคอร์ส',
    htmlContent: `
      <h2>เนื้อหา</h2>
      <p>เนื้อหาของคุณ...</p>
    `,
    passingScore: 80
  }
]
```

---

## 📝 ใช้ใน Database

```typescript
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

## ✅ ข้อดี

- ✅ Static files - deploy ไปกับโปรเจค
- ✅ ไม่ต้อง upload - ไม่มีค่า storage
- ✅ เร็ว - โหลดทันที
- ✅ ง่าย - แก้ไขได้ทันที

**🎉 พร้อมใช้งาน!**
