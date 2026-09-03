# เปิดระบบทดสอบด้วย RunAll.bat

ดับเบิลคลิก `RunAll.bat` ที่โฟลเดอร์หลัก หรือรันจาก Command Prompt

```bat
RunAll.bat
```

ต้องมี Node.js และ npm ใน PATH และเปิด Docker Desktop ให้พร้อม โปรเจกต์ใช้ Node.js 22 ตาม CI/Docker; หาก Node ของระบบเป็นรุ่นอื่น RunAll จะดาวน์โหลด Node.js 22.23.2 แบบ portable มาไว้ใต้ `.runall/runtime` หลังตรวจ SHA-256 จาก release manifest ทางการ โดยไม่เปลี่ยน Node ที่ติดตั้งใน Windows หาก `DATABASE_URL` ว่าง RunAll จะสร้าง PostgreSQL **สำหรับทดสอบ** แยกให้เอง ไม่ใช้ container เก่าของระบบอื่น หากไม่ใช้ Docker ต้องกำหนดฐานข้อมูลทดสอบที่เตรียม schema ไว้แล้ว ห้ามใช้ฐานข้อมูล production เพราะการใช้งานหน้าเว็บสามารถเปลี่ยนข้อมูลได้

หากยังไม่มี environment สำหรับ development ตัวเปิดระบบจะสร้าง `.env.local` พร้อม auth secret แบบสุ่ม แล้วเตรียมฐานข้อมูล Docker ต่อได้เลย ไม่คัดลอก `.env.production` และไม่เขียนทับไฟล์ตั้งค่าที่มีอยู่ ค่า `DATABASE_URL` ว่างในไฟล์หมายถึงให้ใช้ฐานข้อมูลที่ RunAll จัดการ โดย URL จริงจะอยู่ใน environment ของโปรเซสเท่านั้น

ตัวอย่างค่าเชื่อมต่อ (เปลี่ยนชื่อบัญชี รหัสผ่าน พอร์ต และชื่อฐานข้อมูลให้ตรงกับเครื่อง):

```dotenv
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/skillnexus_test"
```

ตัวเปิดระบบจะติดตั้ง dependencies ที่ขาดด้วย `npm ci`, generate Prisma client, ตรวจการเชื่อมต่อและตารางหลัก แล้วเริ่ม Next.js development ที่ localhost เปิดหน้าแรกในเบราว์เซอร์หลัง health API และหน้าแรกตอบสำเร็จ ระหว่างใช้งานให้เปิดหน้าต่าง RunAll ค้างไว้ กด Ctrl+C เพื่อหยุด

สำหรับฐานข้อมูล Docker ที่ RunAll สร้างเองเท่านั้น จะใช้ `prisma db push --skip-generate` เตรียมตารางจาก schema ปัจจุบัน เพราะ migration ใน repository ไม่มี baseline ครบสำหรับฐานใหม่ ไม่ใช้ `--accept-data-loss` หรือ reset จากนั้น upsert บัญชีทดสอบผู้ดูแลและผู้เรียนที่แสดงบนหน้าแรก บัญชีเหล่านี้ไม่ถูกสร้างในฐานข้อมูลที่ผู้ใช้กำหนดเอง ข้อมูลเก็บอยู่ใน volume แยก รหัสผ่าน PostgreSQL แบบสุ่มเก็บใน `.runall/postgres.env` ซึ่งถูก ignore จาก Git อย่าลบหรือแก้ไฟล์นี้หากยังใช้ volume เดิม การปิด RunAll หยุดเฉพาะเว็บ ฐานข้อมูล Docker ยังทำงานและเก็บข้อมูลไว้

สำหรับ `DATABASE_URL` ที่ผู้ใช้กำหนดเอง ไม่มีการสร้าง schema หรือ migrate อัตโนมัติ และไม่มี build production หรือ deploy ในทุกโหมด

Prisma Client ใช้ Library Engine เพื่อรองรับ schema ขนาดใหญ่นี้บน Windows; Binary Engine เดิมอาจค้างที่ขั้นตรวจฐานข้อมูลเพราะต้องส่ง schema ให้ subprocess

ฐานข้อมูลที่ผู้ใช้กำหนดเองต้องมีตารางจาก migration `20260901000000_security_hardening` ด้วย (`quiz_sessions` และ `payment_webhook_events`) RunAll ตรวจตารางเหล่านี้ก่อนเปิด UI โดยไม่ apply migration ให้เอง ส่วนฐาน Docker ของ RunAll จะได้รับตารางจาก schema ปัจจุบันอัตโนมัติ

ตัวเลือกเพิ่มเติม:

```bat
RunAll.bat --port 3001
RunAll.bat --test
RunAll.bat --no-browser
RunAll.bat --check
RunAll.bat --help
```

- `--port`: เปลี่ยนพอร์ต หากพอร์ตที่ระบุถูกใช้อยู่สคริปต์จะหยุด ไม่ฆ่าโปรเซสของโปรแกรมอื่น เมื่อไม่ระบุและพอร์ต 3000 ไม่ว่าง RunAll จะเลือกพอร์ตว่างในช่วง 3001–3020 อัตโนมัติ
- `--test`: รันชุด Jest เดิมก่อนเปิดเว็บ ถ้า test ล้มเหลวจะไม่เปิด UI ชุดทดสอบปัจจุบันอาจต้องแก้ไขตามรายงานตรวจระบบ
- `--no-browser`: เริ่มเว็บโดยไม่เปิดเบราว์เซอร์
- `--check`: ตรวจ prerequisites/ฐานข้อมูลที่ตั้งค่าไว้/พอร์ตเท่านั้น ไม่ติดตั้งหรือ generate ไม่เริ่ม Docker หรือเซิร์ฟเวอร์ หาก DATABASE_URL ว่างจะแนะนำให้รันโหมดปกติ

ถ้าเริ่มระบบไม่สำเร็จจะแสดงข้อผิดพลาดและคงหน้าต่างไว้ให้อ่าน โดยไม่เปิดเบราว์เซอร์รอหน้าเสีย การตรวจ startup นี้ไม่ยืนยันว่าทุกฟีเจอร์หรือมาตรการความปลอดภัยทำงานครบ ระบบยังมีประเด็นตามรายงาน `SYSTEM-COMPLETENESS-REVIEW-2026-09-01.md` จึงจำกัดการเชื่อมต่อไว้ที่เครื่องตนเอง
