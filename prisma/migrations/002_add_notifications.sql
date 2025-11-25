-- Phase 1.5: Smart Notifications System

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('achievement', 'reminder', 'streak', 'course', 'quiz')) DEFAULT 'reminder',
  icon TEXT,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  template_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'reminder',
  icon TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES notification_templates(id)
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  frequency TEXT CHECK(frequency IN ('instant', 'daily', 'weekly', 'never')) DEFAULT 'instant',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, type)
);

-- Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK(type IN ('video', 'quiz', 'course', 'streak')) DEFAULT 'video',
  target_value INTEGER DEFAULT 1,
  reward_points INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE,
  UNIQUE(user_id, challenge_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(date);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_user_id ON user_challenge_progress(user_id);

-- Insert notification templates
INSERT OR IGNORE INTO notification_templates (name, title, message, type, icon, priority) VALUES
('welcome', 'ยินดีต้อนรับ! 🎉', 'เริ่มต้นการเรียนรู้ของคุณวันนี้', 'achievement', '🎉', 'high'),
('daily_reminder', 'เวลาเรียนแล้ว! 📚', 'มาเรียนต่อเพื่อรักษา streak ของคุณ', 'reminder', '📚', 'medium'),
('streak_milestone', 'Streak ใหม่! 🔥', 'คุณเข้าระบบต่อเนื่อง {streak} วันแล้ว!', 'streak', '🔥', 'high'),
('badge_earned', 'ได้เหรียญใหม่! 🏆', 'คุณได้รับเหรียญ "{badge_name}"', 'achievement', '🏆', 'high'),
('course_progress', 'ความก้าวหน้า 📈', 'คุณเรียนไปแล้ว {progress}% ในคอร์ส "{course_name}"', 'course', '📈', 'medium'),
('quiz_reminder', 'แบบทดสอบรอคุณ! 📝', 'มีแบบทดสอบที่ยังไม่ได้ทำ', 'quiz', '📝', 'medium'),
('daily_challenge', 'ภารกิจวันนี้ 🎯', 'ภารกิจใหม่: {challenge_title}', 'reminder', '🎯', 'medium');

-- Insert default notification preferences for existing users
INSERT OR IGNORE INTO notification_preferences (user_id, type, enabled, frequency)
SELECT u.id, 'achievement', true, 'instant' FROM users u;

INSERT OR IGNORE INTO notification_preferences (user_id, type, enabled, frequency)
SELECT u.id, 'reminder', true, 'daily' FROM users u;

INSERT OR IGNORE INTO notification_preferences (user_id, type, enabled, frequency)
SELECT u.id, 'streak', true, 'instant' FROM users u;

-- Insert sample daily challenges
INSERT OR IGNORE INTO daily_challenges (date, title, description, type, target_value, reward_points) VALUES
(date('now'), 'ดูวิดีโอ 2 เรื่อง', 'ดูวิดีโอให้ครบ 2 เรื่องวันนี้', 'video', 2, 100),
(date('now', '+1 day'), 'ทำแบบทดสอบ 1 ครั้ง', 'ทำแบบทดสอบให้ผ่าน 1 ครั้ง', 'quiz', 1, 150),
(date('now', '+2 day'), 'เรียนต่อเนื่อง', 'เข้าระบบและเรียนวันนี้', 'streak', 1, 75);