# ⚡ Quick Start - Deploy uppowerskill.com

## 🎯 เลือกวิธี Deploy

### 🚀 วิธีที่ 1: Cloud Run (แนะนำ - ถูกกว่า)
```bash
.\deploy-cloudrun.bat
```

### 🚀 วิธีที่ 2: App Engine (ง่ายกว่า)
```bash
.\deploy.bat
```

---

## 📋 ข้อมูลสำคัญ

- **Email**: joesive@gmail.com
- **Project**: skillnexus-lms-2025
- **Domain**: uppowerskill.com
- **Database**: 34.124.203.250:5432

---

## 🌐 หลัง Deploy - ตั้งค่า DNS

### ไปที่ Domain Registrar (GoDaddy/Namecheap)

**เพิ่ม DNS Records:**
```
Type: CNAME
Name: @
Value: ghs.googlehosted.com

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

**รอ DNS propagate: 24-48 ชั่วโมง**

---

## 💰 ค่าใช้จ่าย

### Cloud Run (แนะนำ)
- Free: 2M requests/month
- ประมาณ: $10-30/month

### App Engine
- Free: 28 hours/day
- ประมาณ: $50-150/month

---

## 📞 ติดปัญหา?

อ่านคู่มือเต็ม: `DEPLOY_UPPOWERSKILL.md`
