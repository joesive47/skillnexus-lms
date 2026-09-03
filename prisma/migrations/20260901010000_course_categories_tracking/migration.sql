-- Additive migration: no existing course or learner data is deleted.
CREATE TABLE "course_categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "parentId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "course_categories_slug_key" ON "course_categories"("slug");
CREATE UNIQUE INDEX "course_categories_parentId_name_key" ON "course_categories"("parentId", "name");
CREATE INDEX "course_categories_parentId_active_sortOrder_idx" ON "course_categories"("parentId", "active", "sortOrder");
ALTER TABLE "course_categories" ADD CONSTRAINT "course_categories_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "course_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "courses" ADD COLUMN "categoryId" TEXT;
CREATE INDEX "courses_categoryId_published_idx" ON "courses"("categoryId", "published");
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "course_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "course_tracking_events" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "userId" TEXT,
  "event" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'web',
  "sessionId" TEXT,
  "metadata" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "course_tracking_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "course_tracking_events_courseId_event_occurredAt_idx" ON "course_tracking_events"("courseId", "event", "occurredAt");
CREATE INDEX "course_tracking_events_userId_occurredAt_idx" ON "course_tracking_events"("userId", "occurredAt");
CREATE INDEX "course_tracking_events_occurredAt_idx" ON "course_tracking_events"("occurredAt");
ALTER TABLE "course_tracking_events" ADD CONSTRAINT "course_tracking_events_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_tracking_events" ADD CONSTRAINT "course_tracking_events_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
