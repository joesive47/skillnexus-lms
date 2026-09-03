-- Test Script: Phase 1 & 2 Sequential Quiz with Retry Cooldown
-- Run this in database to test the system

-- 1. สร้าง Quiz A (ไม่มี prerequisite, ไม่มี retry delay)
INSERT INTO quizzes (id, title, "courseId", "passScore", "retryDelayMinutes", "createdAt")
VALUES 
  ('test-quiz-a', 'Quiz A: Basic Knowledge', NULL, 70, 0, NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, "passScore" = EXCLUDED."passScore", "retryDelayMinutes" = EXCLUDED."retryDelayMinutes";

-- 2. สร้าง Quiz B (prerequisite = Quiz A, retry delay = 5 minutes)
INSERT INTO quizzes (id, title, "courseId", "passScore", "prerequisiteQuizId", "retryDelayMinutes", "createdAt")
VALUES 
  ('test-quiz-b', 'Quiz B: Advanced Concepts', NULL, 80, 'test-quiz-a', 5, NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, "passScore" = EXCLUDED."passScore", 
    "prerequisiteQuizId" = EXCLUDED."prerequisiteQuizId", 
    "retryDelayMinutes" = EXCLUDED."retryDelayMinutes";

-- 3. สร้าง Quiz C (prerequisite = Quiz B, retry delay = 10 minutes)
INSERT INTO quizzes (id, title, "courseId", "passScore", "prerequisiteQuizId", "retryDelayMinutes", "createdAt")
VALUES 
  ('test-quiz-c', 'Quiz C: Expert Level', NULL, 85, 'test-quiz-b', 10, NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, "passScore" = EXCLUDED."passScore", 
    "prerequisiteQuizId" = EXCLUDED."prerequisiteQuizId", 
    "retryDelayMinutes" = EXCLUDED."retryDelayMinutes";

-- 4. ตรวจสอบว่าสร้างสำเร็จ
SELECT 
  id,
  title,
  "passScore" as pass_score,
  "prerequisiteQuizId" as prerequisite_quiz,
  "retryDelayMinutes" as retry_delay_min,
  "createdAt"
FROM quizzes
WHERE id LIKE 'test-quiz-%'
ORDER BY id;

-- 5. ทดสอบ Foreign Key Relationship
SELECT 
  q.id,
  q.title,
  pq.id as prerequisite_id,
  pq.title as prerequisite_title
FROM quizzes q
LEFT JOIN quizzes pq ON q."prerequisiteQuizId" = pq.id
WHERE q.id LIKE 'test-quiz-%'
ORDER BY q.id;

/*
Expected Output:
┌──────────────┬────────────────────────┬────────────┬──────────────────┬────────────────┐
│ id           │ title                  │ pass_score │ prerequisite_quiz│ retry_delay_min│
├──────────────┼────────────────────────┼────────────┼──────────────────┼────────────────┤
│ test-quiz-a  │ Quiz A: Basic Knowled… │ 70         │ NULL             │ 0              │
│ test-quiz-b  │ Quiz B: Advanced Conc… │ 80         │ test-quiz-a      │ 5              │
│ test-quiz-c  │ Quiz C: Expert Level   │ 85         │ test-quiz-b      │ 10             │
└──────────────┴────────────────────────┴────────────┴──────────────────┴────────────────┘

Testing Flow:
1. Student tries Quiz B → BLOCKED (must pass Quiz A first)
2. Student passes Quiz A (70%+) → Quiz B unlocked
3. Student fails Quiz B (< 80%) → Must wait 5 minutes
4. After 5 minutes → Can retry Quiz B
5. Student passes Quiz B (80%+) → Quiz C unlocked
6. Student fails Quiz C (< 85%) → Must wait 10 minutes
*/
