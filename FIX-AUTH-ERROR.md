# 🔧 แก้ไข Auth Error - "Unexpected token '<'"

**ปัญหา**: FetchError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON

**สาเหตุ**: 
1. `NODE_ENV="production"` ใน .env แต่รัน dev mode
2. Session/Auth configuration ไม่ตรงกัน
3. Server ส่ง HTML แทน JSON

---

## ✅ วิธีแก้ไข (แก้แล้ว)

### 1. เปลี่ยน NODE_ENV
```env
# เปลี่ยนจาก
NODE_ENV="production"

# เป็น
NODE_ENV="development"
```

### 2. Restart Server
```bash
# หยุด server (Ctrl+C)
# แล้วรันใหม่
npm run dev
```

### 3. Clear Browser Cache & Cookies
```
1. กด F12 (Developer Tools)
2. ไปที่ Application tab
3. Clear Storage → Clear site data
4. Reload หน้าเว็บ (Ctrl+Shift+R)
```

### 4. Login ใหม่
```
1. ไปที่ http://localhost:3000/login
2. Login ใหม่
3. ลองสร้างหลักสูตรอีกครั้ง
```

---

## 🎯 ขั้นตอนการทดสอบหลัง Fix

### 1. ตรวจสอบ Server
- [ ] Server รันที่ http://localhost:3000
- [ ] ไม่มี error ใน terminal
- [ ] เห็นข้อความ "Ready in XX seconds"

### 2. ทดสอบ Login
- [ ] เปิด http://localhost:3000/login
- [ ] Login ด้วย admin account
- [ ] เข้าสู่ระบบสำเร็จ

### 3. ทดสอบสร้างหลักสูตร
- [ ] ไปที่ Create New Course
- [ ] กรอกข้อมูล
- [ ] เพิ่มบทเรียน
- [ ] กดปุ่ม "Create Course"
- [ ] ✅ ต้องสร้างสำเร็จ

---

## 🐛 ถ้ายังมีปัญหา

### Error: Body exceeded 1MB limit
**วิธีแก้**:
1. ใช้รูปเล็กกว่า 500KB
2. หรือรอ server restart (แก้ไข next.config.js แล้ว)

### Error: Session expired
**วิธีแก้**:
1. Logout
2. Clear cookies
3. Login ใหม่

### Error: Database connection failed
**วิธีแก้**:
```bash
# ตรวจสอบ database
npx prisma db push
npx prisma generate
```

---

## 📝 Test Account

### Admin:
```
Email: admin@example.com
Password: admin123456
```

### Teacher:
```
Email: teacher@example.com  
Password: teacher123456
```

---

## ✅ Checklist

- [x] แก้ไข NODE_ENV เป็น "development"
- [x] Restart server
- [ ] Clear browser cache
- [ ] Login ใหม่
- [ ] ทดสอบสร้างหลักสูตร

---

**สถานะ**: ✅ แก้ไขเรียบร้อย - รอ restart server แล้วทดสอบใหม่

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 2 กุมภาพันธ์ 2026
