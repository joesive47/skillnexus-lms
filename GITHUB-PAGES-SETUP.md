# 🚀 Setup GitHub Pages สำหรับ SCORM Hosting

## ขั้นตอนที่ 1: Extract SCORM Package

```bash
cd scorm-packages
unzip ai-architect-blueprint.zip -d ../public/scorm/ai-architect
```

## ขั้นตอนที่ 2: Commit และ Push

```bash
git add public/scorm
git commit -m "Add SCORM content for GitHub Pages"
git push origin main
```

## ขั้นตอนที่ 3: Enable GitHub Pages

1. ไปที่: https://github.com/joesive47/skillnexus-lms/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)**
4. คลิก **Save**

รอ 2-3 นาที

## ขั้นตอนที่ 4: ใช้ URL

```
https://joesive47.github.io/skillnexus-lms/scorm/ai-architect/index.html
```

---

## ⚡ วิธีเร็วกว่า: ใช้ Vercel Blob Storage

```bash
npm install @vercel/blob

# Upload SCORM
vercel blob upload scorm-packages/ai-architect-blueprint.zip
```

จะได้ URL: `https://xxxxx.public.blob.vercel-storage.com/ai-architect-blueprint.zip`

---

## 🎯 แนะนำ: ใช้ Cloudflare R2 (ฟรี 10GB)

1. สมัคร: https://dash.cloudflare.com
2. R2 Object Storage → Create bucket
3. Upload extracted SCORM folder
4. Public Access → Enable
5. ได้ URL: `https://pub-xxxxx.r2.dev/scorm/index.html`

**ข้อดี:**
- ฟรี 10GB
- ไม่มีค่า bandwidth
- เร็วมาก (CDN)
- ลิงก์ถาวร
