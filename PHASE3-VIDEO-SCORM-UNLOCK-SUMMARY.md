# Phase 3: Video 80% → SCORM Unlock - Implementation Complete ✅

## 📋 Summary

Phase 3 has been successfully implemented! Users must now watch video lessons to at least **80% completion** before they can access SCORM interactive content.

---

## 🏗️ What Was Built

### 1. **API Route** - Check SCORM Unlock Status
**File:** `src/app/api/lesson/[lessonId]/check-scorm-unlock/route.ts`

- **Endpoint:** `GET /api/lesson/[lessonId]/check-scorm-unlock`
- **Purpose:** Validates if user has watched video to 80%+ to unlock SCORM
- **Logic:**
  - Reads `WatchHistory` model (no schema changes needed!)
  - Calculates: `(watchTime / totalTime) * 100`
  - Returns `canAccess: true` if ≥ 80%, else `false`
- **Response:**
  ```json
  {
    "canAccess": true,
    "videoProgress": 85,
    "requiredProgress": 80,
    "watchHistory": {
      "watchTime": 612,
      "totalTime": 720,
      "completed": true
    },
    "message": "SCORM content unlocked!..."
  }
  ```

### 2. **UI Component** - SCORM Lock Status
**File:** `src/components/scorm/scorm-lock-status.tsx`

- **Loading State:** Shows spinner while checking unlock status
- **Unlocked State:** ✅ Green alert "พร้อมเข้าถึงเนื้อหา SCORM แล้ว!"
  - Shows current video progress (e.g., "ดูแล้ว 85%")
  - Displays watch time (e.g., "10 นาที / 12 นาที")
- **Locked State:** 🔒 Orange card with lock icon
  - Progress bar showing current video completion
  - Badge showing `XX% / 80%`
  - Instructions: "วิธีปลดล็อค SCORM"
  - Action buttons:
    - "ไปดูวิดีโอ" → Navigate to video lesson
    - "ตรวจสอบอีกครั้ง" → Refresh unlock status
    - "กลับไปหน้าคอร์ส" → Back to course

### 3. **Wrapper Component** - SCORM with Video Check
**File:** `src/components/scorm/scorm-with-video-check.tsx`

**Flow:**
```
Step 1: Check video progress via ScormLockStatus
   ↓
Step 2a: If video < 80% → Show lock screen with instructions
Step 2b: If video ≥ 80% → Show ScormFullscreenWrapper (player)
```

### 4. **SCORM Page Integration**
**File:** `src/app/courses/[courseId]/lessons/[lessonId]/scorm/page.tsx`

- **Changed:** Import `ScormWithVideoCheck` instead of `ScormFullscreenWrapper`
- **Result:** All SCORM lessons now require 80% video completion

---

## 🧪 Test Data Created

**SQL Script:** `test-phase3-video-scorm-unlock.sql`

**Test Course:** `test-course-phase3`  
**Test Module:** `test-module-phase3`  
**Test User:** First student from seed data

### Test Scenarios:

| Lesson ID | Title | Video Progress | SCORM Status |
|-----------|-------|----------------|--------------|
| `test-lesson-scorm-locked` | Lesson A: Introduction | **50%** (300/600s) | 🔒 **LOCKED** |
| `test-lesson-scorm-unlocked` | Lesson B: Main Content | **85%** (612/720s) | ✅ **UNLOCKED** |
| `test-lesson-scorm-zero` | Lesson C: Advanced Topics | **0%** (no history) | 🔒 **LOCKED** |

---

## 📊 Database Schema (No Changes!)

Phase 3 uses **existing models** - no migration needed:

```prisma
model WatchHistory {
  id        String   @id @default(cuid())
  userId    String
  lessonId  String
  watchTime Float    @default(0)  // ← Used for progress calculation
  totalTime Float    @default(0)  // ← Used for progress calculation
  completed Boolean  @default(false)
  updatedAt DateTime @updatedAt
  
  @@unique([userId, lessonId])
}

model ScormPackage {
  id          String @id @default(cuid())
  lessonId    String @unique
  packagePath String
  // ...
}
```

**No migration file needed** - WatchHistory already tracks video progress!

---

## 🧪 Testing Checklist

### **Scenario 1: Video Progress 50% - SCORM Locked**

1. **Login:**
   ```
   Email: student@skillnexus.com
   Password: student@123!
   ```

2. **Navigate to SCORM:**
   - Go to: `/courses/test-course-phase3/lessons/test-lesson-scorm-locked/scorm`

3. **Expected Result:**
   - ❌ SCORM player does **NOT** show
   - 🔒 Lock screen appears
   - Progress bar shows **50% / 80%**
   - Orange alert: "กรุณาดูวิดีโอให้ครบ 80%..."
   - Shows: "ดูแล้ว 5 นาที จาก 10 นาที"

4. **Actions Available:**
   - "ไปดูวิดีโอ" → Links to `/courses/test-course-phase3/lessons/test-lesson-scorm-locked`
   - "ตรวจสอบอีกครั้ง" → Refreshes status
   - "กลับไปหน้าคอร์ส" → Returns to course page

---

### **Scenario 2: Video Progress 85% - SCORM Unlocked**

1. **Navigate to SCORM:**
   - Go to: `/courses/test-course-phase3/lessons/test-lesson-scorm-unlocked/scorm`

2. **Expected Result:**
   - ✅ SCORM player shows immediately (fullscreen wrapper)
   - No lock screen

3. **If you refresh the page:**
   - Brief green alert: "พร้อมเข้าถึงเนื้อหา SCORM แล้ว! 🎉"
   - Shows: "ดูแล้ว 85%"
   - Then SCORM player loads

---

### **Scenario 3: Video Progress 0% - SCORM Locked**

1. **Navigate to SCORM:**
   - Go to: `/courses/test-course-phase3/lessons/test-lesson-scorm-zero/scorm`

2. **Expected Result:**
   - ❌ SCORM player does **NOT** show
   - 🔒 Lock screen with progress bar at **0% / 80%**
   - Shows: "ดูแล้ว 0 นาที จาก 8 นาที"
   - Message: "กรุณาดูวิดีโอให้ครบ 80%..."

---

## 🔧 Manual Testing: Simulating Video Watch

To manually test the unlock flow:

### **Option A: Update via Database**

```sql
-- Unlock SCORM for test-lesson-scorm-locked (change 50% → 85%)
UPDATE watch_history
SET 
  "watchTime" = 510,  -- 8.5 minutes (85% of 600 seconds)
  completed = true
WHERE "lessonId" = 'test-lesson-scorm-locked';

-- Verify
SELECT 
  "lessonId",
  ROUND(("watchTime" / "totalTime") * 100) AS progress_pct
FROM watch_history
WHERE "lessonId" = 'test-lesson-scorm-locked';
```

Then refresh the SCORM page - should now show unlocked!

### **Option B: API Testing**

```bash
# Test check-scorm-unlock endpoint
curl http://localhost:3000/api/lesson/test-lesson-scorm-locked/check-scorm-unlock
```

Response should show:
```json
{
  "canAccess": false,
  "videoProgress": 50,
  "requiredProgress": 80,
  "message": "กรุณาดูวิดีโอให้ครบ 80%..."
}
```

---

## 📁 Files Created/Modified

### **Created:**
✅ `src/app/api/lesson/[lessonId]/check-scorm-unlock/route.ts`  
✅ `src/components/scorm/scorm-lock-status.tsx`  
✅ `src/components/scorm/scorm-with-video-check.tsx`  
✅ `test-phase3-video-scorm-unlock.sql`  
✅ `PHASE3-VIDEO-SCORM-UNLOCK-SUMMARY.md` (this file)

### **Modified:**
✅ `src/app/courses/[courseId]/lessons/[lessonId]/scorm/page.tsx`

---

## 🚀 Next Steps

### **Start Dev Server & Test:**

```powershell
npm run dev
```

**Test URLs:**
- Locked (50%): http://localhost:3000/courses/test-course-phase3/lessons/test-lesson-scorm-locked/scorm
- Unlocked (85%): http://localhost:3000/courses/test-course-phase3/lessons/test-lesson-scorm-unlocked/scorm
- Locked (0%): http://localhost:3000/courses/test-course-phase3/lessons/test-lesson-scorm-zero/scorm

**Login Credentials:**
```
Email: student@skillnexus.com
Password: student@123!
```

---

## ⚠️ Important Notes

1. **WatchHistory Tracking:**
   - Phase 3 assumes video player updates `WatchHistory` model
   - If video player doesn't track progress yet, you'll need to:
     - Implement video progress tracking in the video player component
     - Update `WatchHistory` via API as user watches video

2. **80% Threshold:**
   - Hardcoded in: `src/app/api/lesson/[lessonId]/check-scorm-unlock/route.ts`
   - To make configurable: Add `requiredVideoProgress` field to Lesson or Course model

3. **Real-time Updates:**
   - Current implementation: User must manually click "ตรวจสอบอีกครั้ง" to refresh
   - Future enhancement: Auto-refresh when user returns from video page

---

## 🎯 Phase 3 Testing Goals

- [x] Test Scenario 1: 50% progress → SCORM locked
- [ ] Test Scenario 2: 85% progress → SCORM unlocked
- [ ] Test Scenario 3: 0% progress → SCORM locked
- [ ] Test lock screen UI responsiveness
- [ ] Test "ไปดูวิดีโอ" button navigation
- [ ] Test "ตรวจสอบอีกครั้ง" refresh functionality
- [ ] Test progress update after watching more video
- [ ] Verify TypeScript compilation (no errors)
- [ ] Test with different screen sizes (mobile/desktop)

---

## 🔄 Integration with Phase 4

**Next Phase:** SCORM → Quiz Flow

When ready, Phase 4 will:
- Check if user completed SCORM (`ScormProgress.completionStatus = 'completed'`)
- Unlock quiz only after SCORM completion
- Chain: Video 80% → SCORM → Quiz

This creates the full learning path! 🎓

---

**Status:** ✅ Ready for testing!  
**Deployment:** Not yet committed - test locally first  
**Documentation:** Complete
