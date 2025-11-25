-- Add Badge Program tables

CREATE TABLE "badge_programs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "autoIssue" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "badge_programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "badge_requirements" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "badge_requirements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "badge_requirements_badgeId_courseId_key" UNIQUE ("badgeId", "courseId")
);

CREATE TABLE "user_badges_new" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifyCode" TEXT NOT NULL,
    CONSTRAINT "user_badges_new_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_badges_new_verifyCode_key" UNIQUE ("verifyCode"),
    CONSTRAINT "user_badges_new_userId_badgeId_key" UNIQUE ("userId", "badgeId")
);

-- Add foreign key constraints
ALTER TABLE "badge_requirements" ADD CONSTRAINT "badge_requirements_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "badge_requirements" ADD CONSTRAINT "badge_requirements_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges_new" ADD CONSTRAINT "user_badges_new_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges_new" ADD CONSTRAINT "user_badges_new_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;