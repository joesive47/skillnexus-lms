# 🚨 URGENT: Fix Vercel Database Connection

## ปัญหา: Production ไม่สามารถเชื่อมต่อฐานข้อมูลได้

## ✅ Solution: เพิ่ม DATABASE_URL ใน Vercel

### 1. ไปที่ Vercel Dashboard
```
https://vercel.com/dashboard
→ Select uppowerskill.com project
→ Settings → Environment Variables
```

### 2. เพิ่ม DATABASE_URL
```
Key: DATABASE_URL
Value: prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DSTdvdEZ5UGdkdkRJYXBBMEdMaEEiLCJhcGlfa2V5IjoiMDFLQlNEWTJONVNDQUYwOUtDQjg5QjRFRzEiLCJ0ZW5hbnRfaWQiOiI5OTNlODhkMGVhMjBhNmQ1YTUwMjdiOGFiNzBmYTY0NGFlMGMxZGVlNDQ1MDcwN2VlNmMxOGFlN2IwNjk3YWU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNjZkN2E2ZDEtZDZmOS00YjZkLThjZGQtZTVhNDQ0NTZlY2QyIn0.DomkWDfFZJiPs1s06AhiDf3OIi9RVf0UR6m28Rl6n-k
Environment: Production
```

### 3. เพิ่ม Auth Variables (ถ้ายังไม่มี)
```
NEXTAUTH_URL=https://uppowerskill.com
AUTH_URL=https://uppowerskill.com
NEXT_PUBLIC_URL=https://uppowerskill.com
NEXTAUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
AUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
NODE_ENV=production
AUTH_TRUST_HOST=true
```

### 4. Redeploy
```
Deployments → Redeploy (latest deployment)
```

## 🎯 Test After Fix
```
URL: https://uppowerskill.com/login
Email: admin@skillnexus.com
Password: Admin@123!
```