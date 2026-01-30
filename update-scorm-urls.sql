-- Auto-generated SQL script to update SCORM URLs
-- Generated: 2026-01-29T23:49:42.081Z

-- Update: Prompt Engineering Mastery
UPDATE "Course"
SET "scormUrl" = 'https://github.com/joesive47/skillnexus-lms/releases/download/v1.0.0/prompt-engineering-scorm.zip',
    "scormVersion" = '2004',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "title" ILIKE '%Prompt Engineering Mastery%'
  AND "scormUrl" IS NULL;


-- Insert new courses if they don't exist

INSERT INTO "Course" (
  "id", "title", "description", "scormUrl", "scormVersion",
  "duration", "level", "published", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'Prompt Engineering Mastery',
  'SCORM 2004 compliant course',
  'https://github.com/joesive47/skillnexus-lms/releases/download/v1.0.0/prompt-engineering-scorm.zip',
  '2004',
  120,
  'INTERMEDIATE',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

