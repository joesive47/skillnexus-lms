# รายงานตรวจความครบถ้วน SkillNexus / upPowerSkill LMS

> เอกสารนี้บันทึกผลตรวจ **ก่อนแก้ไข** โปรดดูสถานะการแก้และสิ่งที่ยังต้องทดสอบใน [ชุดแก้ไขก่อนทดสอบ](SECURITY-HARDENING-2026-09-01.md)

วันที่ตรวจ: 1 กันยายน 2026

## ข้อสรุป

ระบบมีโครงสร้าง LMS และโค้ดธุรกิจจริงจำนวนมาก เหมาะเป็นฐานสำหรับพัฒนาต่อ แต่ยังไม่ควรเปิดใช้งานกับผู้ใช้จริงหรือรับชำระเงินจริงจากสภาพโค้ดที่ตรวจพบ โดยเฉพาะ API รีเซ็ตรหัสผ่านที่ไม่มีการตรวจสิทธิ์ ความน่าเชื่อถือของผลการเรียน และการออกใบรับรอง

คำว่า Production Ready, Zero Critical Vulnerabilities, Security Score 95/100 และรองรับผู้ใช้พร้อมกัน 100,000 คนใน README ไม่ถือเป็นผลการตรวจยืนยันครั้งนี้ และพบโค้ดที่ขัดกับข้ออ้างด้านความปลอดภัยและความครบถ้วนบางส่วน

ไม่ให้คะแนนเปอร์เซ็นต์ความสมบูรณ์ เพราะไม่มีรายการข้อกำหนดที่ผู้ใช้รับรองและยังไม่ได้ทดสอบระบบครบวงจร การมีไฟล์หรือหน้าเว็บไม่ได้ยืนยันว่าฟีเจอร์นั้นใช้งานได้จริง

## ขอบเขตและข้อจำกัด

- ตรวจไฟล์ในโฟลเดอร์ที่ดาวน์โหลดมาเท่านั้น ไม่ได้ตรวจ GitHub ต้นทาง ประวัติ commit หรือเว็บไซต์ production
- ไม่พบ `.git` จึงไม่สามารถยืนยัน branch, commit หรือความตรงกันกับ GitHub ได้ ลักษณะนี้สอดคล้องกับการดาวน์โหลด ZIP และไม่ใช่ข้อผิดพลาดของระบบโดยตัวมันเอง
- ตรวจโครงสร้างทั้งหมดและอ่านเส้นทางสำคัญแบบเจาะจง ไม่ใช่การรับรองความปลอดภัยทุกบรรทัด
- ไม่ได้ติดตั้ง dependencies ไม่ได้เชื่อมต่อฐานข้อมูล ไม่ได้ migrate/seed และไม่ได้เรียกบริการชำระเงินหรือ API ภายนอก
- ไม่แก้ไข source code; เพิ่มรายงานฉบับนี้เท่านั้น
- ไม่แสดงค่า secret ในรายงาน และไม่ได้ทดสอบว่าค่าที่อยู่ในไฟล์ environment ยังใช้งานได้หรือไม่

## สิ่งที่พบในโปรเจกต์

| รายการ | จำนวน / สถานะ |
|---|---|
| ไฟล์โค้ด JS/TS/JSX/TSX ใต้ src | 792 |
| หน้า App Router (`page.tsx`) | 120 |
| API route (`route.ts`) | 203 |
| Prisma models | 104 |
| ไฟล์ชื่อ `.test.*` / `.spec.*` ใต้ src และ tests | 10 |
| ไฟล์ `.bak` ใต้ src | 24 |
| Framework | Next.js 15.5.7, React, TypeScript |
| ฐานข้อมูลตาม schema | PostgreSQL ผ่าน Prisma |
| Authentication | NextAuth Credentials / JWT |

ตัวเลขเป็นจำนวนไฟล์และโครงสร้าง ไม่ใช่จำนวนฟีเจอร์ที่ผ่านการทดสอบ มีสคริปต์ตรวจสอบอื่นอยู่นอกชุด test ที่นับนี้ด้วย

ตรวจ import แบบระบุพาธภายในโปรเจกต์ด้วยการสแกนข้อความ ไม่พบพาธที่ขาดในรูปแบบที่ตรวจ แต่ไม่ได้ยืนยันชนิดข้อมูล การ export symbol หรือการ resolve dependency ตอน build

## ความครบถ้วนแยกตามส่วน

| ส่วนระบบ | หลักฐานในโค้ด | การประเมิน |
|---|---|---|
| สมัครสมาชิก / เข้าสู่ระบบ / บทบาท | มี auth และการตรวจ ADMIN หลายจุด | มีแกนหลัก แต่สิทธิ์ไม่ได้ครอบคลุมทุกช่องทาง |
| หลักสูตร / บทเรียน / ลงทะเบียน | มี Prisma models, CRUD, validation และ transaction | มี implementation จริงค่อนข้างมาก ต้องทดสอบ workflow และความสอดคล้องของฟิลด์ |
| วิดีโอ / SCORM / ความคืบหน้า | มี player, upload, runtime/progress และ prerequisite | มีโค้ดจริง แต่ยังเชื่อผลและ userId จาก client มากเกินไป |
| Quiz / Skill Assessment / นำเข้า | มีคำถาม คำตอบ การคำนวณผลและการบันทึก | มี implementation จริง แต่ข้อสอบมีช่องว่างด้านการตรวจชุดคำถามและเงื่อนไขผ่าน |
| ใบรับรอง / Badges | มีหลายโมเดลและหลายเส้นทางออกเอกสาร | ทำบางส่วนแล้ว แต่เส้นทางหนึ่งออกได้โดยไม่ตรวจเรียนจบ และ engine บางตัวเป็น stub |
| เครดิต / การซื้อ / Stripe | มี transaction, enrollment และตรวจลายเซ็น webhook | มี implementation จริง แต่ต้องแก้การรับ event ซ้ำและการแข่งขันตัดยอด |
| Chatbot / RAG / Voice | มี retrieval, ประมวลผลเอกสาร และ Voice เรียก OpenAI จริง | ไม่ใช่ mock ทั้งหมด แต่ยังไม่ทดสอบคุณภาพ การตั้งค่า ค่าใช้จ่ายและความทนทาน |
| AI สร้างหลักสูตร / Tutor | CourseGenerator สร้างข้อความ template; Tutor คืนการวิเคราะห์คงที่ | ยังไม่ใช่ AI ที่ทำงานครบตามคำอธิบาย |
| Live classroom | API สร้าง object และ GET คืนห้อง demo | เส้นทางที่ตรวจยังไม่แสดงการเก็บห้องและดำเนินบริการสดครบวงจร |
| Enterprise / Multi-tenant / SSO / MFA | มีหน้าจอและ service แต่มี SQL, schema และการเชื่อม auth ไม่ครบ | ยังไม่พร้อมรับรองการใช้งานองค์กร |
| Deployment / Monitoring / Backup | มี Docker, Vercel, GitHub workflows, health endpoint และ backup job | มีโครงสร้างรองรับ แต่ยังไม่มีผลรันที่ตรวจยืนยันในครั้งนี้ |

## ประเด็นที่ต้องแก้ก่อนใช้งานจริง

### 1. วิกฤต: เปลี่ยนรหัสผ่านและสร้าง/รีเซ็ตบัญชี ADMIN โดยไม่มีการตรวจสิทธิ์

- `src/app/api/debug/reset-password/route.ts:5` รับ email/newPassword แล้วอัปเดตผู้ใช้โดยไม่มี session, reset token หรือการจำกัด environment
- `src/app/api/debug/seed-users/route.ts:5` upsert บัญชีรวมถึง ADMIN ด้วยรหัสผ่านที่กำหนดไว้ใน source และส่งข้อมูลรหัสผ่านกลับ
- `src/middleware.ts` เพิ่ม security headers/CORS แต่ไม่ได้บังคับ authentication ให้ API เหล่านี้

ผลกระทบ: หาก deploy เส้นทางเหล่านี้ให้เข้าถึงได้ บุคคลภายนอกอาจยึดบัญชีได้ ไม่ต้องอาศัยหน้าจอ admin

แนวทาง: นำ debug/reset/seed ออกจาก public deployment; แยกเครื่องมือดูแลไว้เป็น CLI หรือระบบที่ตรวจสิทธิ์เข้มงวด หากเคยเผยแพร่โค้ดชุดนี้ให้ตรวจ access logs และเปลี่ยน credentials ที่เกี่ยวข้องตามผลตรวจ ไม่ได้ยืนยันว่าเคยมีการโจมตี

### 2. สูง: ปลอมความคืบหน้าหรือแก้ผลของผู้อื่นได้

- `src/app/actions/video.ts:6` และ `:67` เป็น Server Actions รับ userId และข้อมูลความคืบหน้าโดยไม่เรียก auth; action หลังเขียน completed=true โดยตรง
- `src/components/classroom/stable-video-player.tsx` มีการ import action ข้างต้น จึงไม่ได้เป็นเพียงไฟล์ตัวอย่างที่แยกไว้
- `src/app/api/scorm/progress/route.ts:56` ใช้ userId จาก body แทน session ได้ โดยไม่ตรวจว่าเป็นตัวเองหรือผู้ดูแล; GET ก็เลือก userId ของผู้อื่นได้

แนวทาง: ผูกตัวตนกับ session ฝั่ง server ตรวจสิทธิ์ลงทะเบียนและเจ้าของข้อมูล บังคับเงื่อนไขความคืบหน้าบน server ตามข้อจำกัดของสื่อ ไม่รับ completed/userId จาก client เป็นหลักฐานเพียงอย่างเดียว

### 3. สูง: ออกใบรับรองโดยไม่ตรวจเรียนจบ

`src/app/api/certificates/issue/route.ts:33` ตรวจ login และใบรับรองเดิม แล้วสร้างใบรับรองจาก courseId ที่รับมา โดยไม่ตรวจ enrollment, ความคืบหน้า หรือผลสอบ

แนวทาง: ใช้จุดตรวจคุณสมบัติกลางก่อนออกใบรับรองทุกช่องทาง และป้องกันการออกซ้ำด้วยข้อกำหนดฐานข้อมูล

### 4. สูง: การส่งข้อสอบเชื่อชุดคำถามจากผู้ส่ง

`src/app/api/quiz/submit/route.ts:63` เลือกนับเฉพาะคำถามที่ปรากฏใน answers แล้วใช้จำนวนดังกล่าวเป็นตัวหารที่บรรทัด 87 ผู้ส่งจึงอาจเลือกส่งเฉพาะข้อที่ตอบถูกแล้วได้คะแนนเต็มของชุดย่อยนั้น

เส้นทางนี้ยังไม่ตรวจ enrollment, เงื่อนไขเรียนก่อนสอบ, retry delay หรือความสัมพันธ์ระหว่าง lessonId กับ quizId ก่อนบันทึกเรียนจบ และจับข้อผิดพลาดการบันทึกบางส่วนแล้วส่งผลสำเร็จต่อไป

แนวทาง: สร้าง quiz attempt ฝั่ง server ผูกชุดคำถามที่แจกจริง ตรวจจำนวนและคำตอบตาม attempt ตรวจสิทธิ์และเงื่อนไขทั้งหมดตอน submit และอย่ารายงานสำเร็จเมื่อบันทึกผลไม่สำเร็จ

### 5. สูง: บันทึกบางส่วนของรหัสผ่านลง log

`src/auth.ts:73` พิมพ์อักขระ 5 ตัวแรกของรหัสผ่านที่ผู้ใช้ป้อน รวมถึงความยาวและส่วนต้นของ hash โดยไม่มีเงื่อนไข development ครอบข้อความเหล่านั้น

แนวทาง: หยุด log ข้อมูลรหัสผ่านทุกส่วน และตรวจการเข้าถึง/การเก็บรักษา log เดิมตามสภาพแวดล้อมที่เคยใช้งาน

### 6. สูง: Stripe webhook อาจเพิ่มเครดิตซ้ำ และการซื้อมี race condition

- `src/app/api/webhooks/stripe/route.ts:83` เพิ่มเครดิตทุกครั้งที่ประมวลผล payment_intent.succeeded ไม่มีการบันทึก event ID หรือเงื่อนไขเปลี่ยนสถานะเพื่อรับประกันว่าผลข้างเคียงเกิดครั้งเดียว
- การอัปเดต payment, enrollment และเครดิตไม่ได้อยู่ใน transaction เดียวกัน จึงเกิดผลบางส่วนสำเร็จและถูกทำซ้ำเมื่อ retry ได้
- `src/app/api/purchase/route.ts` และ `src/app/api/courses/purchase/route.ts` อ่านยอดก่อนเข้า transaction แล้ว decrement โดยไม่ใส่เงื่อนไขยอดเพียงพอในการเขียน หากซื้อหลายคอร์สพร้อมกันอาจผ่านด้วยยอดตั้งต้นเดียวกัน

ข้อดีที่มีอยู่: webhook ตรวจลายเซ็นจริง และการซื้อมี transaction ครอบหลายรายการ แต่ยังไม่แก้ปัญหาข้างต้นทั้งหมด

แนวทาง: บันทึก event แบบ unique, ทำผลข้างเคียงเป็น transaction และตัดเครดิตด้วย atomic conditional update พร้อมทดสอบคำขอพร้อมกัน

### 7. สูง: MFA / WebAuthn ยังไม่เป็นการยืนยันตัวตนที่บังคับใช้ครบ

- `src/auth.ts` อนุญาต Credentials login หลังตรวจรหัสผ่าน โดยไม่ตรวจสถานะ MFA หรือ OTP ก่อนสร้าง session
- `src/lib/security/webauthn.ts` ตรวจเพียงว่ามี credential.response และ challenge ไม่ว่าง ไม่ได้ตรวจลายเซ็น assertion
- `src/app/api/auth/webauthn/verify/route.ts` รับ challenge จากผู้ส่ง และส่วนบันทึก credential เป็น comment แต่ยังตอบว่า registered
- `src/app/api/auth/sso/saml/route.ts` รับ JSON profile ไปค้นหา/สร้างผู้ใช้ ไม่พบการตรวจ signed SAML assertion ในเส้นทางนี้ และไม่สร้าง session แบบ SSO ที่สมบูรณ์

แนวทาง: ทำ authentication flow ที่มี challenge จาก server ตรวจ assertion ด้วย implementation ที่เหมาะสม ผูก MFA เข้ากับการออก session และอย่าแสดงความสำเร็จเมื่อยังไม่บันทึกข้อมูล

### 8. สูง: Enterprise SQL ไม่สอดคล้องกับฐานข้อมูลหลัก

- `prisma/schema.prisma` ใช้ PostgreSQL
- `src/lib/enterprise/tenant-service.ts:29` และ service RBAC/BI/Audit บางส่วนใช้ `datetime('now')`/`date('now')` ในรูปแบบ SQLite
- ไม่พบตาราง tenants/tenant_users/tenant_usage ใน Prisma schema และ migration ที่อยู่ในโฟลเดอร์ versioned ซึ่งตรวจพบ
- มี `prisma/migrations/add_security_tables.sql` สำหรับ MFA แยกเป็นไฟล์ loose SQL; ยังไม่เห็นขั้นตอนรวมไฟล์นี้เข้ากับเส้นทาง migration ปกติที่ตรวจ
- API tenant GET/stats ตรวจ login แต่ไม่เรียก checkTenantAccess ก่อนอ่าน tenantId ที่ระบุมา

แนวทาง: รวม schema/migration ให้ใช้ PostgreSQL อย่างสอดคล้อง ทดสอบสร้างฐานข้อมูลว่าง และบังคับ tenant membership/scope ในทุกจุดอ่านเขียน

## ส่วนที่ยังเป็นโครงร่างหรือข้อมูลจำลอง

- `src/lib/ai/course-generator.ts:68` สร้างเนื้อหา “Content for …”, คำถามและตัวเลือกทั่วไป ไม่ได้เรียกโมเดล AI; API generate-course ใช้ class นี้จริง
- `src/lib/ai/intelligent-tutor.ts:37` คืนจุดแข็ง/จุดอ่อนและคะแนนคงที่
- `src/lib/certification/certification-engine.ts:1`, `badge-engine.ts:1` และ `event-processor.ts:1` ระบุ Stub และคืนค่าว่าง/ศูนย์ มี integration-hooks import ไฟล์เหล่านี้ แม้จะมีไฟล์ `*-full.ts` อยู่ด้วยก็ยังไม่ยืนยันว่าระบบหลักเรียกใช้งานครบ
- `src/app/api/live-classroom/route.ts` POST สร้างเพียง object ตอบกลับ; GET คืน room-demo ไม่ได้อ่านห้องที่สร้างไว้
- `vercel.json` มี crons ว่าง ขณะที่ integration-hooks มีตัวอย่างงานประมวลผล events/วันหมดอายุ ยังไม่ยืนยันว่ามีระบบอื่นทำงานเหล่านี้แทน

ไม่ควรนับฟีเจอร์เหล่านี้ว่าเสร็จเพียงเพราะมีหน้าเมนูหรือ API ตอบ success

## การทดสอบและความพร้อมติดตั้ง

คำสั่งที่ลองจริง:

| คำสั่ง | ผล |
|---|---|
| `npm run build` | เริ่มไม่ได้: ไม่พบคำสั่ง next |
| `npm test -- --runInBand` | เริ่มไม่ได้: ไม่พบคำสั่ง jest |

สาเหตุในสภาพแวดล้อมนี้คือไม่มี node_modules ไม่ใช่ผลพิสูจน์ว่า source compile ไม่ผ่าน การดาวน์โหลด ZIP โดยไม่มี dependencies เป็นเรื่องปกติ ยังต้องติดตั้งด้วย lockfile และตั้งค่าฐานข้อมูลทดสอบก่อนตรวจ runtime ต่อ

ข้อค้นพบเพิ่มเติม:

- `src/app/api/__tests__/courses.test.ts` ใช้ array และ object จำลองในไฟล์เอง ไม่เรียก route จริง จึงไม่ใช่หลักฐานว่าการเชื่อม API/ฐานข้อมูลผ่าน
- ที่บรรทัด 121 นิพจน์ `title && description && category` คืน string แต่บรรทัดถัดไปคาดหวัง boolean true; เป็นข้อผิดพลาดของ test ที่เห็นได้จาก static review ยังไม่ได้รัน Jest เพื่อยืนยันผลรวม
- ไม่พบชุด E2E สำหรับเส้นทางซื้อ → เรียน → สอบ → ออกใบรับรองในการสำรวจครั้งนี้
- `.github/workflows/ci.yml` ยอมให้ npm audit ล้มเหลวแล้ว pipeline ทำต่อได้ (`continue-on-error: true`)
- ไม่มี Prisma CLI ใน dependencies/lockfile แม้หลาย npm scripts เรียก prisma โดยตรง; postinstall ใช้ npx ดาวน์โหลดเวอร์ชันที่ระบุแทน ควรประกาศและล็อก CLI ให้รันซ้ำได้แน่นอน
- พบ script `deploy:verify` ชี้ `prisma/verify-courses.ts` ที่ไม่มีไฟล์
- มี import `@radix-ui/react-collapsible` และ `nanoid` โดยไม่ได้ประกาศเป็น direct dependency แต่มีใน lockfile แบบ transitive จึงยังไม่สรุปว่า import จะล้มเหลว; ควรประกาศสิ่งที่ใช้โดยตรง
- Node ในเครื่องเป็น 25.2.1 ขณะที่ CI ใช้ 18 และ Docker ใช้ 20 ควรเลือก runtime ที่รองรับและทดสอบเป็นมาตรฐานเดียวกัน
- พบ `.env.production`, `.env.backup` และ environment หลายชุดมีรายการค่าถูกตั้งไว้; `.gitignore` ปัจจุบันไม่ได้กันชื่อเหล่านี้ทั้งหมด ต้องตรวจว่าเป็น placeholder หรือ secret จริง และหมุนเวียนค่าที่เคยเผยแพร่จริง ไม่ได้ยืนยันว่า credentials รั่วหรือใช้งานได้
- Migration แบบ versioned ที่พบมี CREATE TABLE 104 รายการ และครอบคลุมชื่อ @@map ทั้งหมดใน schema ปัจจุบัน เป็นจุดเริ่มต้นที่ดี แต่ยังไม่ได้ตรวจสร้างฐานข้อมูลจริงหรือความตรงกันทุก column/constraint

## ลำดับงานที่แนะนำ

1. ปิดช่องทางยึดบัญชีและเปลี่ยนข้อมูลข้ามผู้ใช้ก่อน: debug reset/seed, Server Actions, SCORM, password logs
2. ทำ business rules กลางสำหรับ enrollment, progress, quiz attempts และ certificate eligibility ให้ทุก API/Action ใช้กฎเดียวกัน
3. แก้เครดิต/Stripe ให้ทน event ซ้ำ การบันทึกบางส่วน และคำขอพร้อมกัน
4. ติดตั้ง dependencies ในสภาพแวดล้อมทดสอบ ตั้ง PostgreSQL แยก แล้วตรวจ generate/migrate/typecheck/lint/build/test โดยไม่ข้าม error
5. สร้าง E2E สำหรับ ADMIN/TEACHER/STUDENT รวมทั้งทดสอบเข้าถึงข้อมูลของผู้อื่น สอบโดยข้ามเงื่อนไข และขอใบรับรองก่อนเรียนจบ
6. เลือกฟีเจอร์สำหรับเปิดรุ่นแรกให้ชัด: LMS หลักก่อน; แยก/ซ่อนฟีเจอร์ demo และเชื่อม stub ให้ครบก่อนประกาศใช้งาน
7. ทดสอบ staging, สำรองและกู้คืนฐานข้อมูล, การเก็บไฟล์ถาวร, monitoring และ load test ตามจำนวนผู้ใช้เป้าหมายจริง

เกณฑ์พร้อมเปิดใช้: ปิดประเด็นวิกฤตและสูงในเส้นทางที่จะเปิด, build/test ผ่านจริง, workflow หลักและการปฏิเสธสิทธิ์ผิดผ่าน E2E, ธุรกรรมเงินทำซ้ำได้อย่างปลอดภัย และมีหลักฐานกู้คืนข้อมูลสำเร็จ
