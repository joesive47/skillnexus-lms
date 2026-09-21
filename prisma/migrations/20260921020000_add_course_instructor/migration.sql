-- A course may have one accountable owner. Existing courses remain unassigned
-- until an administrator assigns an instructor in the course editor.
ALTER TABLE "courses"
ADD COLUMN IF NOT EXISTS "instructorId" TEXT;

CREATE INDEX IF NOT EXISTS "courses_instructorId_idx"
ON "courses"("instructorId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'courses_instructorId_fkey'
  ) THEN
    ALTER TABLE "courses"
    ADD CONSTRAINT "courses_instructorId_fkey"
    FOREIGN KEY ("instructorId") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
