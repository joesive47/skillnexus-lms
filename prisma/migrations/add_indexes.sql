-- Phase 8: Database Optimization - Critical Indexes

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(createdAt);
CREATE INDEX IF NOT EXISTS idx_courses_published_created ON courses(published, createdAt);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(userId);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(courseId);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(createdAt);

-- Certificate indexes
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(userId);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(courseId);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON certificates(issuedAt);

-- Watch History indexes
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(userId);
CREATE INDEX IF NOT EXISTS idx_watch_history_lesson_id ON watch_history(lessonId);
CREATE INDEX IF NOT EXISTS idx_watch_history_completed ON watch_history(completed);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(userId);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(createdAt);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(userId);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(createdAt);

-- API Key indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(userId);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(isActive);

-- API Log indexes
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(createdAt);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs(userId);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs(statusCode);

-- Webhook indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(userId);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(isActive);
