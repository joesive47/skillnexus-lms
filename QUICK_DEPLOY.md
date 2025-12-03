# ⚡ Quick Deploy to Google Cloud

## 🚀 Deploy ใน 5 นาที!

### 1️⃣ Login Google Cloud
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2️⃣ Enable APIs
```bash
gcloud services enable appengine.googleapis.com
```

### 3️⃣ Deploy!
```bash
npm run build
gcloud app deploy
```

### 4️⃣ เปิดเว็บ
```bash
gcloud app browse
```

---

## 🔧 ตั้งค่าเพิ่มเติม

### แก้ไข app.yaml
```yaml
env_variables:
  DATABASE_URL: "your-database-url"
  NEXTAUTH_SECRET: "your-secret"
```

### สร้าง Secret Key
```bash
openssl rand -base64 32
```

---

## 📊 ดู Logs
```bash
gcloud app logs tail
```

---

## 🌐 Custom Domain (uppowerskill.com)

### 1. Map Domain
```bash
gcloud app domain-mappings create uppowerskill.com
```

### 2. ตั้งค่า DNS
```
Type: A
Name: @
Value: 216.239.32.21

Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

---

## 💡 Tips

- **Free Tier**: ใช้ `instance_class: F1` และ `min_instances: 0`
- **Production**: ใช้ `instance_class: F4` และ `min_instances: 1`
- **Database**: ใช้ Cloud SQL หรือ external PostgreSQL

---

## 🆘 ปัญหาที่พบบ่อย

### Build Failed
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error
ตรวจสอบ `DATABASE_URL` ใน `app.yaml`

### Out of Memory
เปลี่ยน `instance_class: F4` ใน `app.yaml`

---

**🎉 Done! เว็บของคุณพร้อมใช้งานแล้ว!**
