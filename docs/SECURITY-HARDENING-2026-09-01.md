# ชุดแก้ไขก่อนทดสอบ — 1 กันยายน 2026

สถานะ: ปรับโค้ดป้องกันประเด็นหลักจากรายงานแล้ว แต่ยังไม่รับรองว่าระบบพร้อมใช้งานจริง ไม่ได้รัน Jest, E2E, เปิด UI, เชื่อมฐานข้อมูลจริง, migrate, seed หรือ deploy ในรอบนี้

มีสำเนา source/schema ก่อนแก้ใน `.local-backups/before-security-hardening.zip` และสำเนา config ที่แก้เพิ่มเติมใน `.local-backups/config-originals` ไฟล์สำรองถูกกันออกจาก Git และ TypeScript

## สิ่งที่แก้

### บัญชีและสิทธิ์

- ถอดการทำงานของ public debug/reset/seed endpoints ให้ตอบ 404 รวมถึงช่องทางรีเซ็ตรหัสผ่าน ยึดบัญชี ADMIN ล้างฐานข้อมูล และลงทะเบียนข้ามการซื้อ
- เพิ่ม `access-control.ts` สำหรับตรวจผู้ใช้จริง บทบาทล่าสุด เจ้าของข้อมูล และการลงทะเบียนเรียน
- เพิ่ม guard ให้ 27 handlers ใต้ `/api/admin` รวมถึง API เติมเครดิตที่เดิมไม่มีการตรวจสิทธิ์
- เพิ่มสิทธิ์ ADMIN ให้การสร้าง/แก้ไข/ลบบทเรียน ข้อสอบ และการนำเข้า/แก้ไข assessment กับ seed chatbot ที่พบว่าขาดการตรวจ
- จำกัดข้อมูล assessment result/PDF ให้เจ้าของหรือ ADMIN และไม่ส่ง password hash ติด object ผู้ใช้กลับ
- ลบ log ที่แสดงส่วนต้นของรหัสผ่าน/hash ป้องกัน redirect ออกนอก origin และให้ JWT อ่าน role ล่าสุด; session เก่าหรือ session ที่รหัสผ่านเปลี่ยนต้อง login ใหม่
- สำหรับผู้ใช้ที่มี TOTP เปิดไว้ใน `mfa_settings` แล้ว จะตรวจ OTP ก่อน login เพิ่มช่อง OTP ในหน้า login ส่วนการสมัคร MFA ใหม่ยังปิดไว้จนกว่าจะตรวจครบ

### การเรียนและข้อสอบ

- ใช้ตัวตนจาก session และตรวจ enrollment/ความสัมพันธ์ระหว่าง course, lesson และ quiz
- รวมเส้นทางวิดีโอเดิมเข้ากับ `recordVideoProgress` ไม่รับค่าจบการเรียนจาก client โดยตรง
- ใช้ระยะเวลาวิดีโอในฐานข้อมูลและเวลาระหว่าง heartbeat ฝั่ง server จำกัดการเพิ่มครั้งละไม่เกิน 30 วินาที และล็อกแถวผู้ใช้เมื่อบันทึกจากหลายแท็บ
- วิดีโอที่ไม่มี duration หรือ completion percentage ที่ถูกต้องจะยังไม่ให้ทำเครื่องหมายจบ ต้องให้ ADMIN กำหนด metadata ก่อน
- ตรวจบทเรียนก่อนหน้าก่อนบันทึกวิดีโอ/SCORM หรือเริ่ม/ส่งข้อสอบ
- SCORM ไม่สามารถระบุ userId ของผู้อื่น ตรวจประเภทบทเรียน ขนาดข้อมูล รูปแบบคะแนนและสถานะ แล้วบันทึก progress/runtime/watch history/node progress ใน transaction เดียวกัน
- เพิ่ม `QuizSession` เก็บชุดคำถาม เฉลย เกณฑ์ผ่านและเวลาหมดอายุไว้ในฐานข้อมูล ส่งให้ client เฉพาะ attemptId และคำถามที่ไม่มีเฉลย
- เปลี่ยน QuizClient/API/Server Actions ให้ใช้ attempt เดียวกัน ไม่คำนวณคะแนนจากชุดคำถามที่ client เลือกเอง ข้อที่ไม่ตอบนับเป็นผิด และปฏิเสธคำตอบนอก snapshot
- ตรวจ prerequisite/cooldown/หมดอายุ/เจ้าของ attempt และบันทึก submission, attempt, completion และผลสำหรับรับคำขอซ้ำใน transaction เดียวกัน
- ถ้าบันทึกล้มเหลว จะไม่ส่งผลสำเร็จกลับ
- แก้ syntax ซ้ำใน `quiz-client.tsx` และให้ฟอร์มข้อสอบเก่าใช้หน้าจอกลาง

### ใบรับรอง

- เส้นทางออกใบรับรองที่แก้ใช้การตรวจ enrollment, หลักฐานเรียนครบ และผลสอบผ่านจาก server ก่อนออกเอกสาร
- ไม่ออกใบรับรองให้คอร์สว่าง และไม่ใช้การปัดเศษเปอร์เซ็นต์เป็นหลักฐานว่าจบครบ
- รวม Certificate model ผ่าน issuer กลางที่ใช้ unique user/course ป้องกันการออกซ้ำ เติมฟิลด์ที่ schema ต้องการ และใช้ลายเซ็นที่ผูกกับผู้รับ คอร์ส เลขเอกสาร token และข้อมูล BARD
- ยังมีการคำนวณ BARD จริงใน generator; ไม่แทนด้วยคะแนนจำลอง
- เลิกใช้ signing key ค่าเริ่มต้นที่เดาได้ ตรวจลายเซ็นแบบ timing-safe และตรวจวันหมดอายุใน API ตรวจสอบ BARD certificate
- เพิ่ม eligibility guard ในเส้นทาง CourseCertificate อีกชุดหนึ่งด้วย แต่ระบบยังมีหลายโมเดลใบรับรอง ต้องทดสอบความสอดคล้องและการดาวน์โหลดในรอบ E2E

### การซื้อและชำระเงิน

- API ซื้อทั้งสองชุดและ Server Action ลงทะเบียนใช้ `purchaseCourse` ร่วมกัน
- ตรวจว่าคอร์สเผยแพร่แล้วและใช้ราคาจากฐานข้อมูล ตัดเครดิตด้วยเงื่อนไขยอดเพียงพอในคำสั่งเดียว พร้อม transaction สำหรับ enrollment และบัญชีรายการ
- API เติมเครดิต ADMIN ตรวจจำนวนบวกและบันทึกเครดิต/รายการใน transaction; Server Action เติมเครดิตใช้ increment และคืนยอดจากผลเขียนจริง
- ปิด PATCH ที่ให้ผู้ใช้เปลี่ยนสถานะจ่ายเงินเอง
- จำกัดการอ่านรายการชำระเงินให้เจ้าของหรือ ADMIN และไม่ส่ง user object ทั้งก้อนกลับ
- API สร้าง Stripe payment ใช้ราคาฝั่ง server และ provider idempotency key
- ตรวจลายเซ็น webhook รวมทั้ง payment ID, intent ID, เจ้าของ, คอร์ส, ยอดและสกุลเงิน ก่อนประมวลผล
- เก็บ event ID แบบ unique และใช้ conditional status transition ภายใน transaction เดียวกับ enrollment/เครดิต ไม่เพิ่มรางวัลซ้ำและไม่ลดสถานะ COMPLETED เมื่อได้ failure event ภายหลัง
- ปิด PromptPay QR และบัญชีธนาคารตัวอย่าง ไม่แสดงเป็นช่องทางรับเงินจริง

## ฟีเจอร์ที่ปิดไว้ ไม่ใช่ฟีเจอร์ที่พัฒนาเสร็จแล้ว

- Enterprise/multi-tenant API และหน้าจอ: มี SQL/schema และการแยก tenant ที่ยังต้องพัฒนาต่อ
- SSO, WebAuthn และการตั้งค่า MFA/2FA: ปิด API พร้อมให้ WebAuthn helper ปฏิเสธ assertion ที่ยังไม่ตรวจลายเซ็น
- AI generate-course และ live-classroom: ปิด API ที่คืน template/demo; หน้าห้องเรียนสดแสดงหน้าฟีเจอร์ยังไม่พร้อม
- Hook สำหรับ automatic badges/career certification/events: แจ้งว่า unavailable แทนการเงียบแล้วคืนผลว่าง เส้นทางใบรับรองคอร์สหลักยังอยู่

การปิดนี้ไม่มี environment flag สำหรับเปิดข้ามการตรวจ ต้องเปลี่ยนโค้ดหลังทำ implementation และทดสอบครบ ไม่ได้สร้าง tenant database, signed SAML verifier, WebAuthn verifier, ระบบห้องเรียนสด หรือ AI generator ใหม่ในรอบนี้

## Dependencies และการตั้งค่า

- ประกาศ Prisma CLI 5.22.0, Radix Collapsible และ nanoid โดยตรง พร้อมอัปเดต package-lock จริงด้วย `--package-lock-only --ignore-scripts` ไม่ได้ติดตั้ง dependencies ทั้งระบบหรือเรียก postinstall ในรอบนี้
- เพิ่ม `typecheck`, ESLint config และแก้ script ที่ชี้ไฟล์ตรวจ deployment ซึ่งไม่มีอยู่
- ปิดการข้าม TypeScript/ESLint ใน Next build และให้ CI ไม่มองข้าม npm audit ที่ล้มเหลว
- กำหนด CI/Docker/`.nvmrc` ใช้ Node.js 22 เป็น baseline; เครื่องปัจจุบันยังเป็น Node 25 และยังไม่ได้เปลี่ยน runtime ให้ผู้ใช้ Node 22 อยู่ในกลุ่ม LTS ตาม [ตารางรุ่นทางการ Node.js](https://nodejs.org/en/about/previous-releases)
- ขยาย `.gitignore` กัน environment files ที่ไม่ใช่ตัวอย่างและไฟล์สำรอง ข้อมูลที่เคยถูก commit หรือเปิดเผยก่อนหน้านี้ไม่ได้ถูกลบออกจากประวัติ GitHub โดยการแก้นี้
- RunAll ตรวจตารางใหม่ก่อนเปิดเว็บ สำหรับ DATABASE_URL ที่ผู้ใช้ตั้งค่าเองจะไม่ apply migration อัตโนมัติ หาก DATABASE_URL ว่างจะสร้าง PostgreSQL ใน Docker project/volume แยกและใช้ `prisma db push` เฉพาะฐานที่ RunAll เป็นเจ้าของโดยไม่ยอมรับ data loss

## Migration ที่เตรียมไว้

เส้นทางออก CourseCertificate บันทึกใบรับรองและ certification event ใน transaction เดียว พร้อมล็อกคำขอของผู้เรียนเพื่อกันการออกซ้ำ และส่งข้อผิดพลาดเมื่อบันทึกไม่สำเร็จหรือยังไม่มี certificate definition ที่เปิดใช้งาน แทนการตอบสำเร็จพร้อมใบรับรองว่าง

`prisma/migrations/20260901000000_security_hardening/migration.sql` สร้างตารางใหม่ `quiz_sessions` และ `payment_webhook_events` เท่านั้น ไม่มี DROP/DELETE/RESET

ยังไม่ได้ใช้ migration กับฐานข้อมูลภายนอก ฐานทดสอบ Docker ที่ RunAll สร้างได้รับ schema ปัจจุบันผ่าน `db push` และไม่มีข้อมูล production อย่าใช้ฐานข้อมูลจริงเพื่อทดสอบช่องโหว่หรือเติมข้อมูลตัวอย่าง

## การตรวจที่ทำแล้ว

- TypeScript parser อ่านไฟล์ JS/TS/JSX/TSX ใต้ src โดยไม่โหลดแอป ไม่พบ syntax diagnostics ณ การตรวจครั้งสุดท้าย
- `prisma validate` ผ่าน โดยใช้ DATABASE_URL จำลองและไม่ได้เชื่อมฐานข้อมูล
- ตรวจความสอดคล้องของ Prisma version ใน package.json/package-lock
- Full typecheck ยังยืนยันไม่ได้: การลองตรวจแบบ noResolve มีข้อผิดพลาดจาก dependencies/generated types ที่ยังไม่ได้ติดตั้ง จึงไม่ใช่ผล build ผ่าน
- เพิ่ม regression tests ของ service จริง 6 กรณีใน `src/lib/__tests__/security-hardening.test.ts` แต่ยังไม่รันตามลำดับงานที่ขอ และแก้ boolean assertions ที่ผิดใน course tests เดิม

## งานทดสอบถัดไปและข้อจำกัดที่ยังต้องติดตาม

1. ติดตั้ง dependencies, generate Prisma, ใช้ migration กับ PostgreSQL แยก และรัน typecheck/lint/build/Jest โดยไม่ข้าม error
2. ทดสอบผู้ไม่ login / STUDENT / ADMIN กับ endpoint และ Server Actions โดยตรง รวมถึงปฏิเสธการแก้ข้อมูลของผู้ใช้อื่น
3. ทดสอบ login, OTP ของบัญชีที่เปิด TOTP ไว้, เปลี่ยนรหัสผ่าน และการเปลี่ยน role
4. ทดสอบ partial quiz answers, attempt ของผู้อื่น, คำถามนอก snapshot, retry/expiry, submit ซ้ำ และการ rollback เมื่อฐานข้อมูลผิดพลาด
5. ทดสอบการซื้อหลายคอร์สพร้อมกันและ Stripe events ที่ซ้ำ/สลับลำดับด้วยฐานข้อมูลจริงใน test environment; mocks ไม่ยืนยันการล็อกและ concurrency ของ PostgreSQL
6. ทดสอบทั้งวิดีโอ, SCORM 1.2/2004, learning-node progress, การกลับเข้าเรียนต่อ, summary/dashboard และออก/ดาวน์โหลด/ตรวจใบรับรอง
7. ตรวจคอร์สที่มี INTERACTIVE/ชนิดบทเรียนอื่นเพิ่ม: ผล interactive ที่ client รายงานเองยังไม่ถือเป็นหลักฐานออกใบรับรองอัตโนมัติ การยืนยันจาก SCORM ยังเป็นข้อมูล runtime ฝั่ง client ไม่ใช่ระบบป้องกันทุจริตที่พิสูจน์ตัวผู้เรียนได้สมบูรณ์
8. ตรวจไฟล์ environment ที่เคยเผยแพร่และหมุนเวียน secret จริงตามความจำเป็น; รอบนี้ไม่ได้ตรวจ GitHub ต้นทางหรือเปลี่ยน credentials ของบริการภายนอก
9. ตรวจ dependency vulnerabilities, สำรอง/กู้คืน และ load test ก่อน production; ยังไม่ได้รับรองเรื่อง compliance หรือจำนวนผู้ใช้พร้อมกัน

ไม่ควรใช้ข้อมูลผลเรียนหรือใบรับรองเก่าที่อาจเคยถูกปลอมเป็นหลักฐานโดยไม่ตรวจย้อนหลัง การแก้โค้ดไม่สามารถพิสูจน์หรือซ่อมข้อมูลย้อนหลังได้โดยอัตโนมัติ
