-- ==========================================
-- FIX USER ROLES - Production Database
-- ==========================================
-- Purpose: Correct user roles that may have wrong values
-- Run this in Vercel Postgres Console or any PostgreSQL client
-- Date: 2026-02-15
-- ==========================================

-- Step 1: Backup current roles (for verification)
-- Run this first to see current state:
SELECT email, name, role, "createdAt", "updatedAt" 
FROM "User" 
WHERE email IN (
  'joesive47@gmail.com',
  'student1@example.com',
  'student2@example.com',
  'teacher@example.com',
  'teacher@skillnexus.com',
  'admin@skillnexus.com',
  'admin@example.com'
)
ORDER BY role, email;

-- Step 2: Fix STUDENT roles
-- These users should always be STUDENT
UPDATE "User" 
SET 
  role = 'STUDENT',
  "updatedAt" = NOW()
WHERE email IN (
  'joesive47@gmail.com',
  'student1@example.com',
  'student2@example.com',
  'jss.siriwut@gmail.com',
  'student.demo@skillnexus.com',
  'learner1@skillnexus.com',
  'learner2@skillnexus.com',
  'learner3@skillnexus.com'
)
AND role != 'STUDENT';  -- Only update if role is wrong

-- Step 3: Fix TEACHER roles
-- These users should always be TEACHER
UPDATE "User" 
SET 
  role = 'TEACHER',
  "updatedAt" = NOW()
WHERE email IN (
  'teacher@example.com',
  'teacher@skillnexus.com',
  'instructor@skillnexus.com',
  'tutor@skillnexus.com'
)
AND role != 'TEACHER';  -- Only update if role is wrong

-- Step 4: Fix ADMIN roles
-- These users should always be ADMIN
UPDATE "User" 
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE email IN (
  'admin@skillnexus.com',
  'admin@bizsolve-ai.com',
  'admin@example.com'
)
AND role != 'ADMIN';  -- Only update if role is wrong

-- Step 5: Verify the fix
-- Run this to confirm all roles are correct:
SELECT 
  email, 
  name, 
  role,
  "updatedAt",
  CASE 
    WHEN email IN ('joesive47@gmail.com', 'student1@example.com', 'student2@example.com', 'jss.siriwut@gmail.com', 'student.demo@skillnexus.com', 'learner1@skillnexus.com', 'learner2@skillnexus.com', 'learner3@skillnexus.com') 
      THEN 'Should be STUDENT'
    WHEN email IN ('teacher@example.com', 'teacher@skillnexus.com', 'instructor@skillnexus.com', 'tutor@skillnexus.com') 
      THEN 'Should be TEACHER'
    WHEN email IN ('admin@skillnexus.com', 'admin@bizsolve-ai.com', 'admin@example.com') 
      THEN 'Should be ADMIN'
    ELSE 'Unknown user'
  END as expected_role,
  CASE 
    WHEN email IN ('joesive47@gmail.com', 'student1@example.com', 'student2@example.com', 'jss.siriwut@gmail.com', 'student.demo@skillnexus.com', 'learner1@skillnexus.com', 'learner2@skillnexus.com', 'learner3@skillnexus.com') AND role = 'STUDENT' THEN '✅ Correct'
    WHEN email IN ('teacher@example.com', 'teacher@skillnexus.com', 'instructor@skillnexus.com', 'tutor@skillnexus.com') AND role = 'TEACHER' THEN '✅ Correct'
    WHEN email IN ('admin@skillnexus.com', 'admin@bizsolve-ai.com', 'admin@example.com') AND role = 'ADMIN' THEN '✅ Correct'
    ELSE '❌ WRONG'
  END as status
FROM "User" 
WHERE email IN (
  'joesive47@gmail.com',
  'student1@example.com',
  'student2@example.com',
  'jss.siriwut@gmail.com',
  'student.demo@skillnexus.com',
  'learner1@skillnexus.com',
  'learner2@skillnexus.com',
  'learner3@skillnexus.com',
  'teacher@example.com',
  'teacher@skillnexus.com',
  'instructor@skillnexus.com',
  'tutor@skillnexus.com',
  'admin@skillnexus.com',
  'admin@bizsolve-ai.com',
  'admin@example.com'
)
ORDER BY role, email;

-- ==========================================
-- QUICK FIX for joesive47@gmail.com specifically
-- ==========================================
-- If you only need to fix joesive47@gmail.com, run this:

UPDATE "User" 
SET role = 'STUDENT', "updatedAt" = NOW()
WHERE email = 'joesive47@gmail.com';

-- Verify:
SELECT email, name, role, "updatedAt" 
FROM "User" 
WHERE email = 'joesive47@gmail.com';
