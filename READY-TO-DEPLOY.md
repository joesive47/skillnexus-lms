# ✅ Docker Image พร้อมแล้ว!

Image: `skillnexus-lms:latest` build สำเร็จ

## 🎯 เลือกวิธี Deploy:

### Option 1: AWS App Runner (ต้อง AWS Account)
```powershell
# 1. Configure AWS
aws configure
# ใส่ Access Key, Secret Key, Region: ap-southeast-1

# 2. Run script
.\build.ps1
```

### Option 2: Google Cloud Run (แนะนำ - ง่ายกว่า)
```powershell
# 1. Install gcloud CLI
# Download: https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Deploy (คำสั่งเดียว!)
gcloud run deploy skillnexus-lms `
  --source . `
  --platform managed `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --memory 2Gi
```

### Option 3: Vercel (ง่ายสุด - Free)
```powershell
npm i -g vercel
vercel --prod
```

### Option 4: Railway (1-Click Deploy)
1. ไปที่: https://railway.app
2. Connect GitHub repo
3. Click Deploy
4. Done! (Free $5/month)

### Option 5: Render (Free Tier)
1. ไปที่: https://render.com
2. New → Web Service
3. Connect repo
4. Deploy

## 💡 แนะนำ: Vercel หรือ Railway
- ✅ ไม่ต้อง config AWS
- ✅ Deploy ใน 2 นาที
- ✅ Free tier
- ✅ Auto HTTPS + CDN

## 📦 Docker Image พร้อมใช้
```powershell
docker run -p 3000:3000 skillnexus-lms:latest
```

เลือกวิธีที่ชอบได้เลย! 🚀
