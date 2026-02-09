# Deployment Lessons Learned

## 🚨 จุดสำคัญที่ต้องระวังในการ Deploy

### 1. TypeScript Type Declarations สำหรับ External Packages

**ปัญหา:** `pdf-parse` ไม่มี type declaration ทำให้ TypeScript compile error
```
Type error: Could not find a declaration file for module 'pdf-parse'
```

**วิธีแก้:**
- สร้างไฟล์ `src/types/pdf-parse.d.ts` สำหรับ custom type declarations
- เพิ่ม `typeRoots` ใน `tsconfig.json`:
```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

**บทเรียน:**
- ✅ ตรวจสอบว่า packages ที่ใช้มี type declarations หรือไม่
- ✅ เตรียม custom type declarations ไว้ล่วงหน้าสำหรับ packages ที่ไม่มี @types
- ✅ หลีกเลี่ยงการใช้ `as any` เพราะจะซ่อนปัญหา type safety

---

### 2. Property Access ใน TypeScript Interfaces

**ปัญหา:** เข้าถึง property ที่ไม่มีใน interface
```typescript
Property 'level' does not exist on type 'ThreatResponse'
```

**วิธีแก้:**
- ตรวจสอบ interface definition ให้ชัดเจน
- ใช้ parameter ที่ถูกต้องแทน (ใช้ `severity` แทน `response.level`)

**บทเรียน:**
- ✅ ตรวจสอบ function signature และ parameter types ให้ครบถ้วน
- ✅ อย่าสับสน parameter กับ property ของ object
- ✅ รัน `npx tsc --noEmit` ก่อน commit เสมอ

---

### 3. Security Vulnerabilities (CVE)

**ปัญหา:** Vercel detect CVE-2025-66478 ใน Next.js 15.1.4
```
Error: Vulnerable version of Next.js detected
```

**วิธีแก้:**
- อัปเดต Next.js เป็น version ล่าสุด (15.5.7)
- อัปเดต `eslint-config-next` ให้ตรงกับ Next.js version

**บทเรียน:**
- ✅ ติดตามและอัปเดต dependencies ให้เป็น latest version เสมอ
- ✅ ตรวจสอบ security advisories จาก Vercel/GitHub
- ✅ ใช้ `npm audit` หรือ `npm outdated` เป็นประจำ
- ✅ Match version ของ Next.js กับ eslint-config-next

---

## 🔍 Pre-Deployment Checklist

### ก่อน Build & Deploy ทุกครั้ง:

```bash
# 1. ตรวจสอบ TypeScript errors
npx tsc --noEmit

# 2. ตรวจสอบ outdated packages
npm outdated

# 3. ตรวจสอบ security vulnerabilities
npm audit

# 4. Clean build cache
Remove-Item -Recurse -Force .next

# 5. Test build locally
npm run build

# 6. ตรวจสอบ environment variables
# ยืนยันว่า .env.production มีครบถ้วน
```

---

## 📦 Critical Dependencies ที่ต้องดูแล

### Dependencies ที่ควร monitor:

1. **Next.js & React**
   - ต้อง update version พร้อมกัน
   - ตรวจสอบ breaking changes ใน changelog

2. **TypeScript**
   - อาจมี breaking changes ใน minor versions
   - ทดสอบให้ดีก่อน update

3. **Prisma**
   - ต้อง run `prisma generate` หลัง update
   - ตรวจสอบ migration compatibility

4. **Packages ที่ไม่มี Type Definitions:**
   - pdf-parse
   - mammoth
   - xml2js
   - jszip
   
   → สร้าง custom type declarations ใน `src/types/`

---

## 🛠️ Build Optimization Tips

### เพื่อลดเวลา build และป้องกันปัญหา:

1. **ใช้ typeRoots อย่างถูกต้อง**
   ```json
   "typeRoots": ["./node_modules/@types", "./src/types"]
   ```

2. **External Packages ที่ต้อง externalize**
   ```javascript
   // next.config.js
   serverExternalPackages: [
     'pdf-parse',
     'sharp',
     'onnxruntime-node',
     '@xenova/transformers'
   ]
   ```

3. **Skip type check ใน development**
   ```bash
   npm run build:fast  # ใช้เฉพาะเวลาทดสอบ
   ```

---

## 🚀 การ Deploy ที่มีประสิทธิภาพ

### Workflow ที่แนะนำ:

```bash
# 1. ทำงานใน branch แยก
git checkout -b fix/something

# 2. แก้ไขและ test local
npm run build

# 3. Commit และ push
git add .
git commit -m "fix: description"
git push origin fix/something

# 4. Create PR และรอ Vercel preview build
# 5. ตรวจสอบ preview deployment
# 6. Merge to main เมื่อพร้อม
```

---

## 📝 Common Error Messages & Solutions

### 1. Module not found
```
Cannot find module 'xxx'
```
→ `npm install xxx` หรือเพิ่ม type declaration

### 2. Property does not exist
```
Property 'xxx' does not exist on type 'yyy'
```
→ ตรวจสอบ interface definition และ parameter usage

### 3. Vulnerable dependencies
```
Error: Vulnerable version detected
```
→ `npm update xxx@latest`

### 4. Build timeout
```
Error: Command "npm run build" timed out
```
→ ลด concurrent builds, เพิ่ม memory, หรือ optimize code

---

## ⚡ Performance Monitoring

### ติดตามสิ่งเหล่านี้:

- Build time (ควรไม่เกิน 2-3 นาที)
- Bundle size (First Load JS ควรไม่เกิน 200KB)
- Number of server routes vs static pages
- Middleware size (ควรไม่เกิน 50KB)

---

## 🎯 สรุปแนวทางป้องกันปัญหา

1. **Type Safety First** - ใช้ proper TypeScript types ทุกที่
2. **Update Regularly** - อย่าปล่อย dependencies เก่าไว้นาน
3. **Test Before Deploy** - build local ก่อนเสมอ
4. **Monitor Security** - ติดตาม CVE และ security advisories
5. **Document Everything** - เขียน type declarations และ comments ให้ชัดเจน
6. **Use Git Properly** - branch, commit message, และ PR ให้เป็น best practice

---

**อัปเดตล่าสุด:** February 9, 2026  
**Build Status:** ✅ Passing  
**Next.js Version:** 15.5.7  
**Security Status:** ✅ No Known Vulnerabilities
