# 🧪 วิธีทดสอบ Blob Upload

## 1. ตรวจสอบ Environment Variables

ใน Vercel Dashboard:
- Project → Settings → Environment Variables
- ต้องมี: `BLOB_READ_WRITE_TOKEN`
- Scope: **Production** ✅

## 2. ดู Deployment Logs

1. ไปที่ Vercel → Deployments → ล่าสุด
2. คลิก **View Function Logs**
3. เปิดหน้าที่ใช้ upload รูป
4. ดู logs จะมี:
   ```
   📦 Uploading to Vercel Blob Storage...
   ✅ Blob upload successful: https://...
   ```

## 3. ถ้าเห็น Error

### Error: `Cannot find module '@vercel/blob'`
**แก้:** Vercel จะ auto-install ให้ ไม่ต้องกังวล (ใช้ dynamic import)

### Error: `BLOB_READ_WRITE_TOKEN is not set`
**แก้:** 
1. Vercel → Storage → Blob Store
2. คลิก `.env.local` tab
3. Copy `BLOB_READ_WRITE_TOKEN`
4. ไปที่ Settings → Environment Variables
5. Add variable ชื่อ `BLOB_READ_WRITE_TOKEN`
6. Paste value
7. เลือก Environment: Production ✅
8. Save → Redeploy

### Error: อื่นๆ
ระบบจะ fallback ไปใช้ local storage ใน dev mode อัตโนมัติ

## 4. ดูไฟล์ที่อัปโหลดแล้ว

Vercel → Storage → Blob Store → Browse Files
จะเห็นไฟล์ในโฟลเดอร์ `courses/`

## 5. ลิงก์ไฟล์

ตัวอย่างลิงก์:
```
https://[hash].public.blob.vercel-storage.com/courses/[timestamp]-[filename]
```

ลิงก์เหล่านี้:
- ✅ Public accessible
- ✅ Served via CDN
- ✅ Auto-optimized
- ✅ Support HTTPS

---

## 📊 ตรวจสอบ Usage

Vercel → Storage → Blob Store → Usage
- ดูขนาดไฟล์ที่ใช้
- Free tier: 1GB
- ถ้าเกิน → Upgrade to Pro

---

## 🔧 Troubleshooting Checklist

- [ ] BLOB_READ_WRITE_TOKEN ถูกเพิ่มใน Vercel Environment Variables
- [ ] Environment scope เป็น Production
- [ ] Deployment ล่าสุดสำเร็จ (status = Ready)
- [ ] Code ใหม่ถูก push ไป Git
- [ ] Blob Store ถูก Connect กับ Project
- [ ] ทดสอบ upload รูปผ่าน Admin panel

---

## ✨ เมื่อทุกอย่างทำงาน

คุณจะเห็น:
1. รูปอัปโหลดสำเร็จ ✅
2. URL เป็น `https://xxxxx.public.blob.vercel-storage.com/...`
3. ไม่มี S3 error อีกต่อไป
4. รูปโหลดเร็ว (ผ่าน CDN)
