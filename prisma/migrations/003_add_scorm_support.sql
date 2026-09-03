-- CreateTable
CREATE TABLE "scorm_packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "packagePath" TEXT NOT NULL,
    "manifest" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.2',
    "title" TEXT,
    "identifier" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "scorm_packages_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scorm_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "cmiData" TEXT,
    "completionStatus" TEXT NOT NULL DEFAULT 'incomplete',
    "successStatus" TEXT NOT NULL DEFAULT 'unknown',
    "scoreRaw" REAL,
    "scoreMax" REAL,
    "scoreMin" REAL,
    "sessionTime" TEXT,
    "totalTime" TEXT,
    "location" TEXT,
    "suspendData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "scorm_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "scorm_progress_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "scorm_packages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "scorm_packages_lessonId_key" ON "scorm_packages"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "scorm_progress_userId_packageId_key" ON "scorm_progress"("userId", "packageId");