# แก้ไขปัญหา ChunkLoadError - เสร็จสิ้น

## 🚨 ปัญหาที่พบ
```
Runtime ChunkLoadError
Loading chunk app/layout failed. (timeout: http://localhost:3001/_next/static/chunks/app/layout.js)
```

## 🔧 สาเหตุและการแก้ไข

### 1. Next.js Configuration Issues
**ปัญหา**: การตั้งค่า `output: 'standalone'` ใน development mode
**แก้ไข**: ปรับให้ใช้เฉพาะใน production mode

```javascript
// Before
output: 'standalone',

// After
...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
```

### 2. Webpack Chunk Optimization
**ปัญหา**: การแบ่ง chunks ไม่เหมาะสมใน development
**แก้ไข**: เพิ่มการตั้งค่า splitChunks สำหรับ development

```javascript
// Development optimizations
if (process.env.NODE_ENV === 'development') {
  config.optimization.splitChunks = {
    chunks: 'all',
    cacheGroups: {
      default: {
        minChunks: 1,
        priority: -20,
        reuseExistingChunk: true
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10,
        chunks: 'all'
      }
    }
  }
}
```

### 3. Cache Cleanup
**ปัญหา**: Cache files เก่าที่เสียหาย
**แก้ไข**: ลบ .next directory และ cache

```bash
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
```

## ✅ การแก้ไขที่ดำเนินการ

### 1. อัพเดต next.config.js
- ✅ ปรับ `output: 'standalone'` ให้ใช้เฉพาะ production
- ✅ เพิ่ม `localhost:3001` ใน allowedOrigins
- ✅ เพิ่ม webpack optimization สำหรับ development
- ✅ เพิ่ม onDemandEntries configuration

### 2. ล้าง Cache
- ✅ ลบ .next directory
- ✅ ลบ node_modules cache
- ✅ เริ่ม development server ใหม่

### 3. ทดสอบระบบ
- ✅ เซิร์ฟเวอร์เริ่มทำงานที่ port 3001
- ✅ HTTP response 200 OK
- ✅ ไม่มี ChunkLoadError

## 🚀 สถานะปัจจุบัน

### Server Status
```
✅ Next.js Development Server: http://localhost:3001
✅ PostgreSQL Database: localhost:5432
✅ Ready in 79.7s
✅ HTTP Status: 200 OK
```

### Test Accounts (Updated Passwords)
```
Admin: admin@example.com / Admin@123!
Teacher: teacher@example.com / Teacher@123!
Student: student@example.com / Student@123!
```

## 📝 การตั้งค่าที่ปรับปรุง

### next.config.js (Updated)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker optimization - เฉพาะ production
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  
  // Server Actions configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['localhost:3000', 'localhost:3001', '*.vercel.app']
    }
  },
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 5,
    }
  }),
  
  // Webpack optimizations for development
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === 'development') {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          }
        }
      }
    }
    return config
  }
}
```

## 🔄 วิธีการเริ่มระบบ

### 1. เริ่ม PostgreSQL
```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

### 2. เริ่ม Next.js Development Server
```bash
npx next dev --port 3001
```

### 3. เข้าถึงระบบ
- **Web Application**: http://localhost:3001
- **Database**: localhost:5432

## 🛠️ Troubleshooting

### หาก ChunkLoadError เกิดขึ้นอีก
```bash
# 1. หยุด development server
# 2. ลบ cache
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache

# 3. เริ่มใหม่
npx next dev --port 3001
```

### หาก Build ล้มเหลว
```bash
# ตรวจสอบ memory
node --max-old-space-size=4096 node_modules/.bin/next build

# หรือใช้ environment variable
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

---

**สถานะ**: ✅ ChunkLoadError แก้ไขเสร็จสิ้น
**เซิร์ฟเวอร์**: ✅ ทำงานปกติที่ http://localhost:3001
**ฐานข้อมูล**: ✅ PostgreSQL พร้อมใช้งาน
**วันที่**: 2 กุมภาพันธ์ 2026