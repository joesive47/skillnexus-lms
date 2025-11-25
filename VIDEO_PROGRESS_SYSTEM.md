# ระบบคำนวณความคืบหน้าการเรียนด้วยเวลาจริง

## ภาพรวม

ระบบใหม่นี้คำนวณความคืบหน้าการเรียนโดยใช้เวลาทั้งหมดของวีดีโอและเวลาที่เล่นจริง แทนการใช้เปอร์เซ็นต์อย่างเดิม

## การเปลี่ยนแปลงหลัก

### 1. Database Schema
```prisma
model WatchHistory {
  watchTime  Float    @default(0) // เวลาที่ดูจริง (วินาที)
  totalTime  Float    @default(0) // เวลาทั้งหมดของวีดีโอ (วินาที)
  completed  Boolean  @default(false)
}
```

### 2. Video Players
- **VideoPlayer.tsx**: แสดงเวลาจริง (MM:SS / MM:SS)
- **AntiSkipPlayer.tsx**: ป้องกันการข้ามพร้อมแสดงเวลาจริง

### 3. Progress Calculation
```typescript
// เปอร์เซ็นต์ความคืบหน้า = (เวลาที่ดู / เวลาทั้งหมด) × 100
const progressPercentage = (watchedTime / totalTime) * 100
```

## Components ใหม่

### 1. VideoProgressCard
แสดงความคืบหน้าของวีดีโอแต่ละเรื่อง:
- เวลาที่ดู / เวลาทั้งหมด
- เวลาที่เหลือ
- เปอร์เซ็นต์ความคืบหน้า
- สถานะการเสร็จสิ้น

### 2. CourseProgressSummary
แสดงสรุปความคืบหน้าของคอร์ส:
- จำนวนบทเรียนที่เสร็จ
- เวลาที่ดูรวม
- เวลาที่เหลือ
- ความคืบหน้ารวม

### 3. useVideoProgress Hook
จัดการ state และการบันทึกความคืบหน้า:
- บันทึกทุก 5 วินาที
- คำนวณเปอร์เซ็นต์อัตโนมัติ
- จัดการการเสร็จสิ้น

## Actions ที่อัปเดต

### updateVideoProgress
```typescript
export async function updateVideoProgress(
  userId: string,
  lessonId: string,
  watchedTime: number,  // เวลาที่ดู (วินาที)
  totalTime: number     // เวลาทั้งหมด (วินาที)
)
```

### getCourseProgress
เพิ่มการคำนวณ:
- `timeProgressPercentage`: เปอร์เซ็นต์ตามเวลาจริง
- `watchedDuration`: เวลาที่ดูรวม (วินาที)
- `totalVideoDuration`: เวลาทั้งหมดจาก watch history

## การใช้งาน

### 1. ใน Video Player
```tsx
import { useVideoProgress } from '@/hooks/useVideoProgress'

const { handleProgress, currentTime, totalTime } = useVideoProgress({
  userId,
  lessonId,
  onComplete: () => console.log('เสร็จสิ้น!')
})

// ใน YouTube player callback
onProgress={(watchedTime, totalTime) => handleProgress(watchedTime, totalTime)}
```

### 2. แสดงความคืบหน้า
```tsx
import { VideoProgressCard } from '@/components/course/VideoProgressCard'

<VideoProgressCard
  lessonTitle="บทเรียนที่ 1"
  watchedTime={120}      // 2 นาที
  totalTime={600}        // 10 นาที
  isCompleted={false}
  requiredPercentage={80}
/>
```

### 3. สรุปคอร์ส
```tsx
import { CourseProgressSummary } from '@/components/course/CourseProgressSummary'

<CourseProgressSummary
  courseName="JavaScript Fundamentals"
  totalLessons={10}
  completedLessons={7}
  totalVideoDuration={3600}    // 1 ชั่วโมง
  watchedDuration={2880}       // 48 นาที
  completionPercentage={70}
  timeProgressPercentage={80}
/>
```

## Migration

รัน script เพื่อแปลงข้อมูลเก่า:
```bash
node scripts/migrate-watch-history.js
```

Script จะ:
1. แปลงเปอร์เซ็นต์เป็นเวลาจริง
2. ใช้ duration จาก lesson หรือประมาณ 10 นาที
3. อัปเดต totalTime ในฐานข้อมูล

## ประโยชน์

1. **ความแม่นยำ**: ใช้เวลาจริงแทนเปอร์เซ็นต์
2. **ข้อมูลละเอียด**: แสดงเวลาที่เหลือ, เวลาที่ดู
3. **การติดตาม**: ดูความคืบหน้าแบบเรียลไทม์
4. **ยืดหยุ่น**: รองรับวีดีโอความยาวต่างกัน
5. **ประสบการณ์ผู้ใช้**: UI ที่เข้าใจง่ายขึ้น

## การทดสอบ

1. เปิดวีดีโอใหม่ → ตรวจสอบ totalTime
2. ดูวีดีโอ 2-3 นาที → ตรวจสอบ watchedTime
3. ข้ามวีดีโอ → ตรวจสอบ anti-skip
4. ดูจนครบ 80% → ตรวจสอบการเสร็จสิ้น
5. ดู dashboard → ตรวจสอบสรุปความคืบหน้า