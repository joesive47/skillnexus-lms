-- Seed Data for Certification System
-- Run after: add_certification_system.sql

-- Sample Badges for Different Categories
INSERT INTO "skill_badges" ("badgeName", "skillCategory", "level", "description", "criteriaType", "criteriaValue") VALUES

-- Programming Badges
('JavaScript Beginner', 'Programming', 'BEGINNER', 'Basic JavaScript knowledge', 'ASSESSMENT_SCORE', '{"minScore": 60, "assessmentCategory": "programming"}'),
('JavaScript Intermediate', 'Programming', 'INTERMEDIATE', 'Intermediate JavaScript skills', 'ASSESSMENT_SCORE', '{"minScore": 70, "assessmentCategory": "programming"}'),
('TypeScript Expert', 'Programming', 'ADVANCED', 'TypeScript programming expert', 'ASSESSMENT_SCORE', '{"minScore": 85, "assessmentCategory": "programming"}'),

-- Frontend Badges
('HTML/CSS Master', 'Frontend', 'INTERMEDIATE', 'HTML and CSS expert', 'ASSESSMENT_SCORE', '{"minScore": 75, "assessmentCategory": "frontend"}'),
('Vue.js Developer', 'Frontend', 'ADVANCED', 'Vue.js framework expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "frontend"}'),
('Angular Developer', 'Frontend', 'ADVANCED', 'Angular framework expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "frontend"}'),

-- Backend Badges
('Express.js Expert', 'Backend', 'ADVANCED', 'Express.js framework expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "backend"}'),
('Database Master', 'Backend', 'ADVANCED', 'Database design and optimization', 'ASSESSMENT_SCORE', '{"minScore": 85, "assessmentCategory": "database"}'),
('API Design Expert', 'Backend', 'EXPERT', 'RESTful and GraphQL API design', 'ASSESSMENT_SCORE', '{"minScore": 90, "assessmentCategory": "backend"}'),

-- DevOps Badges
('Docker Expert', 'DevOps', 'ADVANCED', 'Container orchestration expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "devops"}'),
('CI/CD Master', 'DevOps', 'ADVANCED', 'Continuous integration and deployment', 'ASSESSMENT_SCORE', '{"minScore": 85, "assessmentCategory": "devops"}'),

-- Data Science Badges
('SQL Expert', 'Data Science', 'ADVANCED', 'SQL query optimization expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "data"}'),
('Machine Learning Practitioner', 'Data Science', 'EXPERT', 'Machine learning algorithms expert', 'ASSESSMENT_SCORE', '{"minScore": 90, "assessmentCategory": "ml"}'),

-- Design Badges
('UI/UX Designer', 'Design', 'INTERMEDIATE', 'User interface and experience design', 'ASSESSMENT_SCORE', '{"minScore": 75, "assessmentCategory": "design"}'),
('Figma Expert', 'Design', 'ADVANCED', 'Figma design tool expert', 'ASSESSMENT_SCORE', '{"minScore": 80, "assessmentCategory": "design"}');

-- Sample Certifications
INSERT INTO "skill_certifications" ("certificationName", "description", "category", "minimumBadgeLevel", "validityMonths", "imageUrl") VALUES

-- Web Development
('Professional Web Developer', 'Complete web development certification covering frontend and backend', 'Web Development', 'INTERMEDIATE', NULL, NULL),
('Senior Full Stack Engineer', 'Advanced full stack development certification', 'Full Stack', 'EXPERT', 36, NULL),

-- Specialized Certifications
('React Specialist', 'React framework development certification', 'Frontend', 'ADVANCED', 24, NULL),
('Node.js Backend Specialist', 'Backend development with Node.js certification', 'Backend', 'ADVANCED', 24, NULL),
('Cloud DevOps Engineer', 'Cloud infrastructure and DevOps certification', 'DevOps', 'ADVANCED', 24, NULL),
('Data Engineer', 'Data engineering and analytics certification', 'Data Science', 'ADVANCED', 24, NULL);

-- Sample User for Testing (คุณสามารถใช้ userId ของจริง)
-- สมมติว่ามี user 'test-user-123'

-- Issue sample badges to test user
-- INSERT INTO "user_skill_badges" ("userId", "badgeId", "evidenceType", "evidenceId", "verificationCode") 
-- SELECT 
--   'test-user-123', 
--   id, 
--   'ASSESSMENT', 
--   'test-assessment-1', 
--   'BADGE-' || substr(md5(random()::text), 1, 10)
-- FROM "skill_badges" 
-- WHERE "badgeName" IN ('JavaScript Expert', 'React Master');

SELECT 'Certification seed data inserted successfully!' as message;
SELECT COUNT(*) as total_badges FROM "skill_badges";
SELECT COUNT(*) as total_certifications FROM "skill_certifications";
