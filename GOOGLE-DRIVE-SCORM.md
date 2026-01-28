# 📁 Google Drive - SCORM Hosting Guide

## ขั้นตอนที่ 1: Extract SCORM Package

1. ไปที่ folder: `C:\API\The-SkillNexus\scorm-packages\`
2. Extract `ai-architect-blueprint.zip`
3. จะได้ folder `ai-architect-blueprint` ที่มีไฟล์:
   - index.html (หรือ module1.html)
   - imsmanifest.xml
   - res/ (resources)
   - shared/

## ขั้นตอนที่ 2: Upload ไป Google Drive

1. ไปที่: https://drive.google.com
2. คลิก **New** → **Folder upload**
3. เลือก folder `ai-architect-blueprint` ทั้งหมด
4. รอ upload เสร็จ

## ขั้นตอนที่ 3: Share Folder

1. คลิกขวาที่ folder `ai-architect-blueprint`
2. เลือก **Share** → **Get link**
3. เปลี่ยนเป็น **Anyone with the link**
4. Permission: **Viewer**
5. คลิก **Copy link**

## ขั้นตอนที่ 4: แปลง URL

**URL ที่ได้จาก Google Drive:**
```
https://drive.google.com/drive/folders/1ABC...XYZ?usp=sharing
```

**แปลงเป็น (เปิด index.html):**
```
https://drive.google.com/file/d/FILE_ID/view
```

**หรือใช้ Google Sites:**
1. สร้าง Google Site ใหม่
2. Embed folder เข้าไป
3. Publish
4. ได้ URL: `https://sites.google.com/view/your-site/scorm`

---

## ⚠️ ปัญหาของ Google Drive

- ❌ ไม่รองรับ direct file access
- ❌ มี CORS issues
- ❌ ไม่เหมาะสำหรับ SCORM

---

## ✅ แนะนำ: ใช้ Netlify Drop (ง่ายที่สุด)

### ขั้นตอน:

1. ไปที่: https://app.netlify.com/drop
2. Drag & Drop folder `ai-architect-blueprint`
3. รอ 10 วินาที
4. ได้ URL ทันที: `https://random-name.netlify.app/index.html`

**ข้อดี:**
- ✅ ฟรี
- ✅ ไม่ต้องสมัคร
- ✅ ได้ URL ทันที
- ✅ รองรับ SCORM 100%
- ✅ HTTPS + CDN

---

## 🎯 ตัวอย่าง URL ที่ใช้ได้:

```
https://your-scorm.netlify.app/index.html
https://your-scorm.netlify.app/module1.html
```

ใส่ URL นี้ใน LMS ได้เลย!
