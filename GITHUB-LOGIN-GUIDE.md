# 🔐 GitHub CLI Login - Quick Guide

## ⚡ ขั้นตอนการ Login (1 นาที)

### 1. รันคำสั่ง Login
```bash
gh auth login
```

### 2. เลือกตัวเลือกตามนี้:

**? What account do you want to log into?**
```
> GitHub.com
```

**? What is your preferred protocol for Git operations?**
```
> HTTPS
```

**? Authenticate Git with your GitHub credentials?**
```
> Yes
```

**? How would you like to authenticate GitHub CLI?**
```
> Login with a web browser
```

### 3. Copy Code และเปิด Browser
```
! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
```

**ทำตามนี้:**
1. Copy code ที่แสดง (เช่น `ABCD-1234`)
2. กด Enter
3. Browser จะเปิดขึ้นมา
4. Paste code ที่ copy ไว้
5. กด "Authorize GitHub CLI"
6. Done!

---

## ✅ ตรวจสอบว่า Login สำเร็จ

```bash
gh auth status
```

**ควรเห็น:**
```
✓ Logged in to github.com as [your-username]
✓ Git operations for github.com configured to use https protocol.
✓ Token: *******************
```

---

## 🚀 หลังจาก Login แล้ว

### รัน Script อีกครั้ง:
```bash
.\deploy-scorm.bat
```

**หรือ:**
```bash
node scripts\deploy-scorm.js
```

---

## 🎯 ทำไมต้อง Login?

GitHub CLI ต้องการ Authentication เพื่อ:
- ✅ สร้าง Release
- ✅ Upload files
- ✅ จัดการ Repository

**Login ครั้งเดียว ใช้ได้ตลอด!**

---

## 🐛 Troubleshooting

### ❌ Browser ไม่เปิด
```bash
# เปิด URL manually
https://github.com/login/device

# Paste code ที่ได้
```

### ❌ Token หมดอายุ
```bash
# Login ใหม่
gh auth logout
gh auth login
```

### ❌ ต้องการใช้ Token แทน Browser
```bash
gh auth login --with-token < token.txt
```

---

## 📝 Alternative: ใช้ Personal Access Token

### 1. สร้าง Token
1. ไปที่: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. เลือก scopes:
   - ✅ `repo` (Full control)
   - ✅ `workflow`
4. Generate token
5. Copy token

### 2. Login ด้วย Token
```bash
# Windows
echo YOUR_TOKEN | gh auth login --with-token

# หรือสร้างไฟล์
echo YOUR_TOKEN > token.txt
gh auth login --with-token < token.txt
del token.txt
```

---

## ✅ Ready!

หลังจาก Login แล้ว รัน:
```bash
.\deploy-scorm.bat
```

**จะทำงานต่อได้เลย!** 🚀

---

*Last Updated: January 2025*
