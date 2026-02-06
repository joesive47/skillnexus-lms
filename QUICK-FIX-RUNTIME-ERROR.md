# 🔧 แก้ไข Runtime Error - Connection Closed

**ปัญหา**: Runtime Error: Connection closed  
**สาเหตุ**: อาจเกิดจาก Checkbox component หรือ imports ที่ไม่ถูกต้อง

---

## 🚨 วิธีแก้ไขด่วน

### วิธีที่ 1: ใช้ไฟล์สำรอง (แนะนำ)

```bash
# กลับไปใช้ไฟล์เดิมที่ทำงานได้
copy src\components\course\course-form.backup.tsx src\components\course\course-form.tsx
```

### วิธีที่ 2: แก้ไข Checkbox Import

ถ้า error เกี่ยวกับ Checkbox ให้แก้ไขใน `course-form.tsx`:

```typescript
// เปลี่ยนจาก
import { Checkbox } from '@/components/ui/checkbox'

// เป็น
import * as React from 'react'
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

// หรือใช้ input checkbox แทน
<input 
  type="checkbox"
  checked={selectedLessons.includes(index)}
  onChange={() => toggleSelection(index)}
  className="rounded border-gray-300"
/>
```

### วิธีที่ 3: ลบ .next และ rebuild

```bash
# Windows CMD
rmdir /s /q .next
npm run dev

# หรือ PowerShell
Remove-Item -Recurse -Force .next
npm run dev
```

### วิธีที่ 4: ตรวจสอบ dependencies

```bash
# ติดตั้ง dependencies ที่ขาดหาย
npm install @radix-ui/react-checkbox
npm install lucide-react
npm install sonner

# หรือติดตั้งใหม่ทั้งหมด
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 ตรวจสอบ Error

### 1. ดู Error Message ใน Terminal

```bash
# ดู logs
npm run dev
```

### 2. ตรวจสอบ Browser Console

กด F12 ใน browser แล้วดู Console tab

### 3. ตรวจสอบ Network Tab

ดูว่ามี request ไหน fail

---

## ✅ วิธีแก้ไขแบบถาวร

### สร้างไฟล์ course-form.tsx ใหม่ (แบบปลอดภัย)

ใช้ไฟล์นี้แทน:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourse, updateCourse } from '@/app/actions/course'
import { createCourseWithScorm, updateCourseWithScorm } from '@/app/actions/course-scorm'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronUp, ChevronDown, Trash2, Plus, Copy, GripVertical, Eye, Trash } from 'lucide-react'

// ใช้ input checkbox แทน Checkbox component
// เพื่อหลีกเลี่ยง dependency issues

export function CourseForm({ course, mode = 'create' }) {
  // ... rest of the code
}
```

---

## 🎯 แนวทางที่แนะนำ

### สำหรับ Development (localhost):

1. **ใช้ไฟล์สำรอง** - กลับไปใช้เวอร์ชันที่ทำงานได้
2. **ทดสอบทีละฟีเจอร์** - เพิ่มฟีเจอร์ใหม่ทีละอย่าง
3. **ตรวจสอบ errors** - แก้ไข error ทันทีที่เจอ

### สำหรับ Production (Vercel):

1. **Deploy เวอร์ชันที่ stable** - ใช้โค้ดที่ทดสอบแล้ว
2. **ใช้ Environment Variables** - แยก config dev/prod
3. **Monitor errors** - ใช้ Vercel Analytics

---

## 📝 Checklist ก่อน Deploy

- [ ] ✅ ทดสอบบน localhost ไม่มี error
- [ ] ✅ Build สำเร็จ (`npm run build`)
- [ ] ✅ ทดสอบทุกฟีเจอร์
- [ ] ✅ ตรวจสอบ console ไม่มี warnings
- [ ] ✅ ทดสอบบน mobile
- [ ] ✅ Commit และ push

---

## 🚀 คำสั่งที่ใช้บ่อย

```bash
# เริ่ม dev server
npm run dev

# Build production
npm run build

# Start production server
npm start

# ตรวจสอบ TypeScript errors
npx tsc --noEmit

# ตรวจสอบ ESLint
npm run lint

# Format code
npm run format
```

---

## 💡 Tips

1. **ใช้ Git** - commit บ่อยๆ เพื่อสามารถ rollback ได้
2. **ทดสอบก่อน deploy** - อย่า deploy โค้ดที่ยังไม่ได้ทดสอบ
3. **Monitor logs** - ดู Vercel logs เมื่อ deploy
4. **Backup database** - สำรองข้อมูลก่อนทำการเปลี่ยนแปลงใหญ่

---

**จัดทำโดย**: Kiro AI Assistant  
**วันที่**: 2 กุมภาพันธ์ 2026
