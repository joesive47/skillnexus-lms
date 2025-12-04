# 🚀 Simple Deploy - ใช้ Google Cloud Run แทน

Docker build ซับซ้อนเกินไป ใช้ Google Cloud Run ง่ายกว่า:

## 1. Install Google Cloud CLI
```powershell
# Download from: https://cloud.google.com/sdk/docs/install
gcloud init
```

## 2. Deploy ด้วยคำสั่งเดียว
```powershell
gcloud run deploy skillnexus-lms `
  --source . `
  --platform managed `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 2 `
  --min-instances 1 `
  --max-instances 10
```

## 3. Set Environment Variables
```powershell
gcloud run services update skillnexus-lms `
  --region asia-southeast1 `
  --set-env-vars="DATABASE_URL=YOUR_DB_URL,NEXTAUTH_SECRET=YOUR_SECRET"
```

## ✅ Done!
- ไม่ต้อง build Docker เอง
- Auto-scaling built-in
- HTTPS automatic
- ราคา: ~$20-40/month

## Alternative: Vercel (ง่ายที่สุด)
```bash
npm i -g vercel
vercel --prod
```
- Free tier: 100GB bandwidth
- Auto deploy from Git
- Zero config
