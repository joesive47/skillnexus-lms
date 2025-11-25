# Video Components

ระบบเครื่องเล่นวีดีโอใหม่ที่เรียบง่ายและมีประสิทธิภาพ

## Components

### VideoPlayer
เครื่องเล่นวีดีโอพื้นฐานที่รองรับ YouTube

```tsx
import { VideoPlayer } from '@/components/video'

<VideoPlayer
  youtubeId="VIDEO_ID"
  onProgress={(progress) => console.log(progress)}
  onComplete={() => console.log('completed')}
  initialProgress={0}
  requiredWatchPercentage={85}
/>
```

### AntiSkipPlayer
เครื่องเล่นวีดีโอที่มีระบบป้องกันการข้าม

```tsx
import { AntiSkipPlayer } from '@/components/video'

<AntiSkipPlayer
  youtubeId="VIDEO_ID"
  onProgress={(progress) => console.log(progress)}
  onComplete={() => console.log('completed')}
  initialProgress={0}
  requiredWatchPercentage={85}
/>
```

### VideoPlayerWrapper
Wrapper สำหรับจัดการ server actions

```tsx
import { VideoPlayerWrapper } from '@/components/video'

<VideoPlayerWrapper
  youtubeId="VIDEO_ID"
  lessonId="LESSON_ID"
  courseId="COURSE_ID"
  userId="USER_ID"
  initialProgress={0}
  requiredWatchPercentage={85}
/>
```

## Features

- ✅ เรียบง่ายและเร็ว
- ✅ รองรับ YouTube API
- ✅ ระบบป้องกันการข้าม
- ✅ บันทึกความคืบหน้าอัตโนมัติ
- ✅ UI ที่สวยงาม
- ✅ รองรับ fullscreen
- ✅ แสดงสถานะการเล่น

## Migration

ไฟล์เดิมที่ถูกแทนที่:
- `EnhancedVideoPlayer.tsx` → `VideoPlayer.tsx`
- `RestrictedYouTubePlayer.tsx` → `AntiSkipPlayer.tsx`
- `VideoPlayerWrapper.tsx` → `VideoPlayerWrapper.tsx` (อัปเดต)

## Usage Examples

### Basic Video Player
```tsx
<VideoPlayer
  youtubeId="dQw4w9WgXcQ"
  onProgress={(progress) => {
    console.log(`Progress: ${progress}%`)
  }}
  onComplete={() => {
    console.log('Video completed!')
  }}
/>
```

### Anti-Skip Player
```tsx
<AntiSkipPlayer
  youtubeId="dQw4w9WgXcQ"
  onProgress={(progress) => {
    console.log(`Progress: ${progress}%`)
  }}
  onComplete={() => {
    console.log('Video completed!')
  }}
  requiredWatchPercentage={90}
/>
```

### With Server Actions
```tsx
<VideoPlayerWrapper
  youtubeId="dQw4w9WgXcQ"
  lessonId="lesson-123"
  courseId="course-456"
  userId="user-789"
  requiredWatchPercentage={85}
/>
```