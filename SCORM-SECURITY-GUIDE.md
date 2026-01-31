# 🔒 SCORM Security & Protection System

## 📋 Overview

ระบบป้องกัน SCORM URL และควบคุมการเข้าถึงเนื้อหา เพื่อป้องกันการแชร์ลิงก์ให้ผู้อื่นโดยไม่ได้รับอนุญาต

## 🎯 Features

### 1. Token-Based Authentication
- สร้าง temporary token ที่หมดอายุใน 2 ชั่วโมง
- ตรวจสอบสิทธิ์การเข้าถึงก่อนให้ token
- Auto-cleanup expired tokens

### 2. Proxy API
- ซ่อน URL จริงของ SCORM content
- นักเรียนเห็นแค่ `/api/scorm/proxy?token=xxx`
- Proxy content จาก external source

### 3. Security Headers
- `X-Frame-Options: SAMEORIGIN` - ป้องกัน embed ไปเว็บอื่น
- `Content-Security-Policy: frame-ancestors 'self'` - จำกัด iframe
- `Cache-Control: private, no-cache` - ป้องกัน cache

### 4. Client-Side Protection
- ป้องกัน right-click context menu
- ป้องกัน F12, Ctrl+Shift+I (DevTools)
- Sandbox iframe with limited permissions

### 5. Responsive Design
- Device mode switcher (Mobile/Tablet/Desktop)
- Fullscreen support
- Adaptive aspect ratios

## 🚀 Quick Start

### สำหรับ Admin/Teacher

#### 1. เพิ่ม SCORM Lesson
```typescript
// ใน lesson creation form
const lesson = await prisma.lesson.create({
  data: {
    title: "Introduction to SCORM",
    courseId: "course-id",
    moduleId: "module-id",
    youtubeUrl: "https://your-scorm-host.netlify.app/", // SCORM URL
    type: "VIDEO", // ใช้ type VIDEO สำหรับ SCORM
    duration: 30,
    order: 1
  }
})
```

#### 2. ดู SCORM URL ในหน้า Edit Course
- ไปที่ `/dashboard/admin/courses/[courseId]/edit`
- จะเห็น URL แสดงใต้ชื่อบทเรียน
- คลิกปุ่ม "คัดลอก" เพื่อ copy URL

### สำหรับ Student

#### 1. เข้าเรียน SCORM
```typescript
import { SecureScormPlayer } from '@/components/scorm/SecureScormPlayer'

<SecureScormPlayer 
  lessonId="lesson-id"
  onComplete={() => {
    console.log('SCORM completed!')
  }}
/>
```

#### 2. ใช้งาน Player
- คลิกไอคอน 📱 = Mobile view (375px, 9:16)
- คลิกไอคอน 📱 (แนวนอน) = Tablet view (768px, 4:3)
- คลิกไอคอน 🖥️ = Desktop view (Full width, 16:9)
- คลิก ⛶ = Fullscreen mode

## 🔧 API Reference

### POST /api/scorm/proxy
Generate access token

**Request:**
```json
{
  "lessonId": "lesson-id"
}
```

**Response:**
```json
{
  "token": "abc123...",
  "expiresAt": 1234567890
}
```

**Errors:**
- `401` - Unauthorized (ไม่ได้ login)
- `403` - Access denied (ไม่มีสิทธิ์เข้าถึง)
- `500` - Internal server error

### GET /api/scorm/proxy
Proxy SCORM content

**Query Parameters:**
- `token` (required) - Access token
- `path` (optional) - Path to SCORM file (default: /index.html)

**Response:**
- SCORM content with security headers

**Errors:**
- `401` - Invalid or expired token
- `404` - SCORM not found
- `500` - Proxy error

## 🔐 Security Best Practices

### 1. Token Management
```typescript
// Token หมดอายุใน 2 ชั่วโมง
const expiresAt = Date.now() + 2 * 60 * 60 * 1000

// ใช้ Redis ใน production แทน in-memory
// const redis = new Redis()
// await redis.setex(`scorm:${token}`, 7200, JSON.stringify(tokenData))
```

### 2. Access Control
```typescript
// ตรวจสอบ enrollment ก่อนให้ token
const enrollment = await prisma.enrollment.findFirst({
  where: {
    userId: session.user.id,
    course: {
      lessons: {
        some: { id: lessonId }
      }
    }
  }
})

if (!enrollment) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}
```

### 3. Content Security
```typescript
// Security headers
headers: {
  'X-Frame-Options': 'SAMEORIGIN',
  'Content-Security-Policy': "frame-ancestors 'self'",
  'Cache-Control': 'private, no-cache, no-store, must-revalidate'
}
```

## 📊 Monitoring & Analytics

### Track SCORM Events
```typescript
// ใน SCORM player
window.addEventListener('message', (event) => {
  if (event.data?.type === 'scorm-complete') {
    // Track completion
    await fetch('/api/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId })
    })
  }
})
```

### Monitor Token Usage
```typescript
// Log token generation
console.log(`Token generated for user ${userId}, lesson ${lessonId}`)

// Track expired tokens
const expiredCount = Array.from(activeTokens.values())
  .filter(t => t.expiresAt < Date.now()).length
```

## 🐛 Troubleshooting

### ปัญหา: Token expired
**สาเหตุ:** Token หมดอายุ (2 ชั่วโมง)
**แก้ไข:** Refresh หน้าเพื่อสร้าง token ใหม่

### ปัญหา: SCORM ไม่โหลด
**สาเหตุ:** CORS หรือ external URL ไม่ถูกต้อง
**แก้ไข:** 
1. ตรวจสอบ SCORM URL ใน database
2. ตรวจสอบ CORS headers ของ SCORM host
3. ดู browser console สำหรับ errors

### ปัญหา: Access denied
**สาเหตุ:** User ไม่ได้ enroll ในหลักสูตร
**แก้ไข:** Enroll user ในหลักสูตรก่อน

## 🔄 Migration Guide

### จาก youtubeUrl เป็น scormUrl

ถ้าต้องการแยก field:

```prisma
model Lesson {
  id          String   @id @default(cuid())
  title       String
  youtubeUrl  String?  // สำหรับ YouTube videos
  scormUrl    String?  // สำหรับ SCORM packages
  // ... other fields
}
```

```typescript
// Update proxy API
const scormUrl = lesson.scormUrl || lesson.youtubeUrl
```

## 📈 Performance Optimization

### 1. Use Redis for Token Storage
```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Store token
await redis.setex(`scorm:${token}`, 7200, JSON.stringify(tokenData))

// Get token
const data = await redis.get(`scorm:${token}`)
```

### 2. Cache SCORM Content
```typescript
// Add caching layer
const cacheKey = `scorm:${lessonId}:${path}`
const cached = await redis.get(cacheKey)

if (cached) {
  return new NextResponse(cached, { headers })
}
```

### 3. CDN for SCORM Files
- Host SCORM บน CDN (CloudFront, Cloudflare)
- Enable compression (gzip, brotli)
- Set appropriate cache headers

## 🎓 Best Practices

1. **Always validate enrollment** before generating tokens
2. **Use HTTPS** for all SCORM content
3. **Monitor token usage** for suspicious activity
4. **Implement rate limiting** on token generation
5. **Log all access attempts** for audit trail
6. **Regular security audits** of SCORM content
7. **Keep tokens short-lived** (2 hours max)
8. **Clean up expired tokens** regularly

## 📞 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:
- 📧 Email: support@skillnexus.com
- 📚 Documentation: /docs/scorm-security
- 🐛 Report bugs: GitHub Issues

---

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** Production Ready ✅
