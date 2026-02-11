-- CreateTable: Notification
-- Add Notification system for real-time alerts

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "action_url" TEXT,
  "metadata" TEXT,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "read_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") 
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for performance
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- Comments
COMMENT ON TABLE "notifications" IS 'User notifications for course events, achievements, etc.';
COMMENT ON COLUMN "notifications"."type" IS 'Type: COURSE_ENROLLED, QUIZ_PASSED, CERTIFICATE_ISSUED, ACHIEVEMENT_UNLOCKED, etc.';
COMMENT ON COLUMN "notifications"."metadata" IS 'JSON metadata for additional data';
