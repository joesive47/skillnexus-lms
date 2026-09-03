-- Add Certification System Tables
-- Migration: add_certification_system
-- Created: February 2026

-- 1. Skill Badges (Badge Definitions)
CREATE TABLE IF NOT EXISTS "skill_badges" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "badgeName" TEXT NOT NULL,
  "skillCategory" TEXT NOT NULL,
  "level" TEXT NOT NULL, -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  "description" TEXT,
  "imageUrl" TEXT,
  
  -- Criteria
  "criteriaType" TEXT NOT NULL, -- ASSESSMENT_SCORE, QUIZ_SCORE, COURSE_HOURS, COMBINED
  "criteriaValue" TEXT NOT NULL, -- JSON
  
  -- Open Badges
  "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus Academy',
  "issuerUrl" TEXT,
  "issuerEmail" TEXT,
  
  -- Expiry
  "expiryMonths" INTEGER, -- NULL = never expires
  
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Skill Badges (Issued Badges)
CREATE TABLE IF NOT EXISTS "user_skill_badges" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "badgeId" TEXT NOT NULL,
  
  -- Issue details
  "issuedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiryDate" TIMESTAMP,
  
  -- Evidence
  "evidenceType" TEXT, -- ASSESSMENT, QUIZ, COURSE, MANUAL
  "evidenceId" TEXT,
  "evidenceUrl" TEXT,
  "evidenceData" TEXT, -- JSON
  
  -- Verification
  "verificationCode" TEXT NOT NULL UNIQUE,
  
  -- Status
  "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED
  "revokedAt" TIMESTAMP,
  "revokedReason" TEXT,
  
  -- Foreign keys
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("badgeId") REFERENCES "skill_badges"("id") ON DELETE CASCADE,
  
  -- Unique constraint: one badge per evidence
  UNIQUE("userId", "badgeId", "evidenceId")
);

-- 3. Skill Certifications (Certification Definitions)
CREATE TABLE IF NOT EXISTS "skill_certifications" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "certificationName" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  
  -- Requirements
  "minimumBadgeLevel" TEXT, -- All badges must be >= this level
  
  -- Issuer
  "issuerName" TEXT NOT NULL DEFAULT 'SkillNexus Academy',
  "issuerUrl" TEXT,
  "issuerLogo" TEXT,
  
  -- Validity
  "validityMonths" INTEGER, -- NULL = lifetime
  
  -- Assets
  "imageUrl" TEXT,
  "certificateTemplate" TEXT,
  
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Certification Badges (Mapping Table)
CREATE TABLE IF NOT EXISTS "certification_badges" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "certificationId" TEXT NOT NULL,
  "badgeId" TEXT NOT NULL,
  "isRequired" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  
  FOREIGN KEY ("certificationId") REFERENCES "skill_certifications"("id") ON DELETE CASCADE,
  FOREIGN KEY ("badgeId") REFERENCES "skill_badges"("id") ON DELETE CASCADE,
  
  UNIQUE("certificationId", "badgeId")
);

-- 5. User Certifications (Issued Certifications)
CREATE TABLE IF NOT EXISTS "user_certifications" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "certificationId" TEXT NOT NULL,
  
  -- Issue details
  "issueDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiryDate" TIMESTAMP,
  
  -- Verification
  "certificationNumber" TEXT NOT NULL UNIQUE,
  "verificationCode" TEXT NOT NULL UNIQUE,
  "verificationUrl" TEXT,
  "digitalSignature" TEXT,
  
  -- Status
  "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED
  
  -- Snapshot
  "earnedBadgesSnapshot" TEXT NOT NULL, -- JSON array of badge IDs
  
  -- PDF
  "pdfUrl" TEXT,
  "pdfGeneratedAt" TIMESTAMP,
  
  "revokedAt" TIMESTAMP,
  "revokedReason" TEXT,
  
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("certificationId") REFERENCES "skill_certifications"("id") ON DELETE CASCADE
);

-- 6. Certification Events (Event Log)
CREATE TABLE IF NOT EXISTS "certification_events" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventType" TEXT NOT NULL, -- BADGE_EARNED, CERT_ISSUED, BADGE_EXPIRED, CERT_EXPIRED
  "userId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL, -- BADGE, CERTIFICATION
  "entityId" TEXT NOT NULL,
  "metadata" TEXT, -- JSON
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS "idx_user_badges_userId" ON "user_skill_badges"("userId");
CREATE INDEX IF NOT EXISTS "idx_user_badges_status" ON "user_skill_badges"("status");
CREATE INDEX IF NOT EXISTS "idx_user_certs_userId" ON "user_certifications"("userId");
CREATE INDEX IF NOT EXISTS "idx_user_certs_status" ON "user_certifications"("status");
CREATE INDEX IF NOT EXISTS "idx_events_processed" ON "certification_events"("processed");
CREATE INDEX IF NOT EXISTS "idx_events_type" ON "certification_events"("eventType");

-- Insert Sample Badges
INSERT INTO "skill_badges" ("id", "badgeName", "skillCategory", "level", "description", "criteriaType", "criteriaValue", "imageUrl") VALUES
('badge_js_expert', 'JavaScript Expert', 'Programming', 'ADVANCED', 'Master of JavaScript programming', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "programming"}', NULL),
('badge_react_master', 'React Master', 'Frontend', 'ADVANCED', 'Expert in React framework', 'ASSESSMENT_SCORE', '{"minScore": 85, "assessmentCategory": "frontend"}', NULL),
('badge_nodejs_expert', 'Node.js Expert', 'Backend', 'ADVANCED', 'Backend development with Node.js', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "backend"}', NULL),
('badge_python_master', 'Python Master', 'Programming', 'ADVANCED', 'Python programming expert', 'ASSESSMENT_SCORE', '{"minScore": 82, "assessmentCategory": "programming"}', NULL),
('badge_data_analyst', 'Data Analyst', 'Data Science', 'INTERMEDIATE', 'Data analysis and visualization', 'ASSESSMENT_SCORE', '{"minScore": 75, "assessmentCategory": "data-science"}', NULL);

-- Insert Sample Certifications
INSERT INTO "skill_certifications" ("id", "certificationName", "description", "category", "minimumBadgeLevel", "validityMonths") VALUES
('cert_fullstack', 'Full Stack Developer', 'Complete full stack web development certification', 'Full Stack', 'ADVANCED', NULL),
('cert_frontend', 'Frontend Developer', 'Frontend development specialist certification', 'Frontend', 'ADVANCED', 24),
('cert_backend', 'Backend Developer', 'Backend development specialist certification', 'Backend', 'ADVANCED', 24);

-- Map Badges to Certifications
INSERT INTO "certification_badges" ("certificationId", "badgeId", "isRequired", "order") VALUES
-- Full Stack Developer requires 3 badges
('cert_fullstack', 'badge_js_expert', true, 1),
('cert_fullstack', 'badge_react_master', true, 2),
('cert_fullstack', 'badge_nodejs_expert', true, 3),

-- Frontend Developer requires 2 badges
('cert_frontend', 'badge_js_expert', true, 1),
('cert_frontend', 'badge_react_master', true, 2),

-- Backend Developer requires 2 badges
('cert_backend', 'badge_js_expert', true, 1),
('cert_backend', 'badge_nodejs_expert', true, 2);

-- Success message
SELECT 'Certification System tables created successfully!' as message;
