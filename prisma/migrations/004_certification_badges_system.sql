-- Migration: Certification & Badges System
-- Creates comprehensive certification and badge system with clear separation

-- Media Assets for badges and certificates
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "url" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- Badge Design Templates
CREATE TABLE "badge_design_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateData" TEXT NOT NULL,
    "previewUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_design_templates_pkey" PRIMARY KEY ("id")
);

-- Course Certificate Definitions
CREATE TABLE "course_certificate_definitions" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "templateHtml" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus LMS',
    "issuerTitle" TEXT NOT NULL DEFAULT 'Learning Management System',
    "expiryMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_certificate_definitions_pkey" PRIMARY KEY ("id")
);

-- Course Certificate Criteria
CREATE TABLE "course_certificate_criteria" (
    "id" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "criteriaType" TEXT NOT NULL,
    "criteriaValue" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "course_certificate_criteria_pkey" PRIMARY KEY ("id")
);

-- Course Certificates (issued)
CREATE TABLE "course_certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "pdfUrl" TEXT,

    CONSTRAINT "course_certificates_pkey" PRIMARY KEY ("id")
);

-- Course Badge Definitions
CREATE TABLE "course_badge_definitions" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "designData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_badge_definitions_pkey" PRIMARY KEY ("id")
);

-- Course Badges (issued)
CREATE TABLE "course_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "course_badges_pkey" PRIMARY KEY ("id")
);

-- Career Paths
CREATE TABLE "career_paths" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("id")
);

-- Career Path Courses (mapping)
CREATE TABLE "career_path_courses" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "career_path_courses_pkey" PRIMARY KEY ("id")
);

-- Career Requirements (rule engine)
CREATE TABLE "career_requirements" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "requirementType" TEXT NOT NULL,
    "requirementValue" TEXT NOT NULL,
    "logicType" TEXT NOT NULL DEFAULT 'AND',

    CONSTRAINT "career_requirements_pkey" PRIMARY KEY ("id")
);

-- Career Certificate Definitions
CREATE TABLE "career_certificate_definitions" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "templateHtml" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus LMS',
    "issuerTitle" TEXT NOT NULL DEFAULT 'Career Development Program',
    "expiryMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_certificate_definitions_pkey" PRIMARY KEY ("id")
);

-- Career Certificates (issued)
CREATE TABLE "career_certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "courseBadgesSnapshot" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "pdfUrl" TEXT,

    CONSTRAINT "career_certificates_pkey" PRIMARY KEY ("id")
);

-- Career Badge Definitions
CREATE TABLE "career_badge_definitions" (
    "id" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "designData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_badge_definitions_pkey" PRIMARY KEY ("id")
);

-- Career Badges (issued)
CREATE TABLE "career_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerPathId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "career_badges_pkey" PRIMARY KEY ("id")
);

-- Verification Records (public verification)
CREATE TABLE "verification_records" (
    "id" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- Create Unique Constraints
CREATE UNIQUE INDEX "course_certificate_definitions_courseId_key" ON "course_certificate_definitions"("courseId");
CREATE UNIQUE INDEX "course_certificates_verificationCode_key" ON "course_certificates"("verificationCode");
CREATE UNIQUE INDEX "course_certificates_userId_courseId_key" ON "course_certificates"("userId", "courseId");
CREATE UNIQUE INDEX "course_badge_definitions_courseId_key" ON "course_badge_definitions"("courseId");
CREATE UNIQUE INDEX "course_badges_userId_courseId_key" ON "course_badges"("userId", "courseId");
CREATE UNIQUE INDEX "career_path_courses_careerPathId_courseId_key" ON "career_path_courses"("careerPathId", "courseId");
CREATE UNIQUE INDEX "career_certificate_definitions_careerPathId_key" ON "career_certificate_definitions"("careerPathId");
CREATE UNIQUE INDEX "career_certificates_verificationCode_key" ON "career_certificates"("verificationCode");
CREATE UNIQUE INDEX "career_certificates_userId_careerPathId_key" ON "career_certificates"("userId", "careerPathId");
CREATE UNIQUE INDEX "career_badge_definitions_careerPathId_key" ON "career_badge_definitions"("careerPathId");
CREATE UNIQUE INDEX "career_badges_userId_careerPathId_key" ON "career_badges"("userId", "careerPathId");
CREATE UNIQUE INDEX "verification_records_verificationCode_key" ON "verification_records"("verificationCode");

-- Create Indexes for Performance
CREATE INDEX "media_assets_createdBy_idx" ON "media_assets"("createdBy");
CREATE INDEX "course_certificates_verificationCode_idx" ON "course_certificates"("verificationCode");
CREATE INDEX "course_certificates_userId_status_idx" ON "course_certificates"("userId", "status");
CREATE INDEX "course_badges_userId_status_idx" ON "course_badges"("userId", "status");
CREATE INDEX "career_certificates_verificationCode_idx" ON "career_certificates"("verificationCode");
CREATE INDEX "career_certificates_userId_status_idx" ON "career_certificates"("userId", "status");
CREATE INDEX "career_badges_userId_status_idx" ON "career_badges"("userId", "status");
CREATE INDEX "verification_records_verificationCode_idx" ON "verification_records"("verificationCode");

-- Add Foreign Key Constraints
ALTER TABLE "course_certificate_definitions" ADD CONSTRAINT "course_certificate_definitions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_certificate_criteria" ADD CONSTRAINT "course_certificate_criteria_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_certificates" ADD CONSTRAINT "course_certificates_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_badge_definitions" ADD CONSTRAINT "course_badge_definitions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_badge_definitions" ADD CONSTRAINT "course_badge_definitions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "course_badge_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_badges" ADD CONSTRAINT "course_badges_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "course_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_path_courses" ADD CONSTRAINT "career_path_courses_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_path_courses" ADD CONSTRAINT "career_path_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_requirements" ADD CONSTRAINT "career_requirements_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_certificate_definitions" ADD CONSTRAINT "career_certificate_definitions_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_certificates" ADD CONSTRAINT "career_certificates_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "career_certificate_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_badge_definitions" ADD CONSTRAINT "career_badge_definitions_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_badge_definitions" ADD CONSTRAINT "career_badge_definitions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_careerPathId_fkey" FOREIGN KEY ("careerPathId") REFERENCES "career_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "career_badge_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "career_badges" ADD CONSTRAINT "career_badges_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "career_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE;