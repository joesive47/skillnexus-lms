# 🔧 Vercel Environment Variables Update

## Copy these to Vercel Dashboard → Settings → Environment Variables

```bash
# Database (existing)
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DSTdvdEZ5UGdkdkRJYXBBMEdMaEEiLCJhcGlfa2V5IjoiMDFLQlNEWTJONVNDQUYwOUtDQjg5QjRFRzEiLCJ0ZW5hbnRfaWQiOiI5OTNlODhkMGVhMjBhNmQ1YTUwMjdiOGFiNzBmYTY0NGFlMGMxZGVlNDQ1MDcwN2VlNmMxOGFlN2IwNjk3YWU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNjZkN2E2ZDEtZDZmOS00YjZkLThjZGQtZTVhNDQ0NTZlY2QyIn0.DomkWDfFZJiPs1s06AhiDf3OIi9RVf0UR6m28Rl6n-k

# Authentication URLs (UPDATE THESE)
NEXTAUTH_URL=https://uppowerskill.com
AUTH_URL=https://uppowerskill.com
NEXT_PUBLIC_URL=https://uppowerskill.com
NEXTAUTH_URL_INTERNAL=https://uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://uppowerskill.com

# Secrets (existing)
NEXTAUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
AUTH_SECRET=skillnexus-super-secret-key-2024-production-ready

# Environment
NODE_ENV=production
AUTH_TRUST_HOST=true
```

## 🎯 Steps:
1. Go to Vercel Dashboard
2. Select uppowerskill.com project
3. Settings → Environment Variables
4. Update/Add above variables
5. Redeploy

## ✅ Test:
- URL: https://uppowerskill.com/login
- Email: admin@skillnexus.com
- Password: Admin@123!