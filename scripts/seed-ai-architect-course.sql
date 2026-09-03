-- AI Architect Course Setup
-- Run this in your database

-- Insert Course
INSERT INTO courses (id, title, description, price, published, "imageUrl", "createdAt", "updatedAt")
VALUES (
  'ai-architect-001',
  'AI Architect''s Blueprint: จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code',
  'เรียนรู้การใช้ Amazon Q และ VS Code ในการพัฒนาระบบจริง

📚 เนื้อหาที่จะได้เรียนรู้:
- Prompt Engineering สำหรับ Architects
- การใช้ Amazon Q ในการออกแบบระบบ
- VS Code Tips & Tricks
- สร้างระบบจริงด้วย AI Assistant

🎯 เหมาะสำหรับ:
- Software Architects
- Senior Developers
- Tech Leads
- ผู้ที่สนใจ AI-Assisted Development',
  0,
  true,
  '/images/ai-architect-course.jpg',
  NOW(),
  NOW()
);

-- Insert Lesson
INSERT INTO lessons (id, "courseId", title, type, "lessonType", "order", content, duration, "createdAt")
VALUES (
  'lesson-prompt-eng-001',
  'ai-architect-001',
  'Prompt Engineering Practice',
  'SCORM',
  'SCORM',
  1,
  'Interactive SCORM lesson for practicing prompt engineering',
  30,
  NOW()
);

-- Insert SCORM Package
INSERT INTO scorm_packages (id, "lessonId", "packagePath", manifest, version, title, identifier, "createdAt", "updatedAt")
VALUES (
  'scorm-prompt-001',
  'lesson-prompt-eng-001',
  '/scorm/prompt-engineering',
  '{"identifier":"SCORM_PROMPT_ENG_001","title":"Prompt Engineering for Architects","version":"1.2"}',
  '1.2',
  'Prompt Engineering for Architects',
  'SCORM_PROMPT_ENG_001',
  NOW(),
  NOW()
);
