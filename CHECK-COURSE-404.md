# วิธีตรวจสอบว่าคอร์สมีอยู่หรือไม่ใน Production

## 1. ตรวจสอบผ่าน Admin Dashboard

ไปที่: https://www.uppowerskill.com/dashboard/admin/courses

ดูรายการคอร์สทั้งหมด และคัดลอก Course ID ที่ถูกต้อง

## 2. ตรวจสอบว่า Course ID `cmlccqk0i00015hih00few2zi` มีอยู่หรือไม่

หน้า 404 อาจเกิดจาก:

### สาเหตุที่เป็นไปได้:

1. **Course ID ไม่มีอยู่จริง**
   - คอร์สอาจถูกลบ
   - ID ไม่ถูกต้อง
   - แก้ไข: ไปดู course list และใช้ ID ที่ถูกต้อง

2. **Build/Deployment ยังไม่เสร็จ**
   - Vercel กำลัง deploy อยู่
   - แก้ไข: รอ deployment เสร็จ 2-3 นาที

3. **Cache issue**
   - Browser หรือ CDN cache หน้าเก่า
   - แก้ไข: Hard refresh (Ctrl+Shift+R) หรือเปิด incognito

## 3. ทดสอบ

### ตรวจสอบโครงสร้าง URL:
✅ ถูกต้อง: `/dashboard/admin/courses/[courseId]/edit`
❌ ผิด: `/admin/courses/[courseId]/edit` (ขาด /dashboard)

### ตรวจสอบ permissions:
- ต้อง login เป็น ADMIN หรือ TEACHER
- ตรวจสอบว่า login ถูก role

## 4. ขั้นตอนแก้ไข:

1. ไปที่ https://www.uppowerskill.com/dashboard/admin/courses
2. หาคอร์สที่ต้องการแก้ไข
3. คลิกปุ่ม "แก้ไข" หรือ "Edit"
4. ระบบจะพาไปหน้า edit ที่ถูกต้อง

## 5. Fallback:

หากยังไม่ได้ ให้:
1. ตรวจสอบ Vercel deployment logs
2. ตรวจสอบ Runtime logs ใน Vercel dashboard
3. ดูว่ามี error message อะไรใน console
