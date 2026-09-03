-- Phase 1: Gamification Tables
-- Add gamification tables to existing schema

-- User Points System
CREATE TABLE IF NOT EXISTS user_points (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Badges System
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria TEXT, -- JSON string
  rarity TEXT CHECK(rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Badges Junction
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

-- Login Streaks
CREATE TABLE IF NOT EXISTS login_streaks (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Activity Log for Points Tracking
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  description TEXT,
  metadata TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_login_streaks_user_id ON login_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Insert default badges
INSERT OR IGNORE INTO badges (name, description, criteria, rarity) VALUES
('First Steps', 'เข้าสู่ระบบครั้งแรก', '{"first_login": true}', 'common'),
('Early Bird', 'เข้าสู่ระบบ 3 วันติดต่อกัน', '{"login_streak": 3}', 'common'),
('Dedicated Learner', 'เข้าสู่ระบบ 7 วันติดต่อกัน', '{"login_streak": 7}', 'rare'),
('Streak Master', 'เข้าสู่ระบบ 30 วันติดต่อกัน', '{"login_streak": 30}', 'epic'),
('Video Watcher', 'ดูวิดีโอครบ 1 เรื่อง', '{"videos_completed": 1}', 'common'),
('Course Starter', 'เริ่มเรียนคอร์สแรก', '{"courses_started": 1}', 'common'),
('Quiz Taker', 'ทำแบบทดสอบครั้งแรก', '{"quizzes_taken": 1}', 'common'),
('Perfect Score', 'ได้คะแนนเต็มในแบบทดสอบ', '{"perfect_quiz": 1}', 'rare'),
('Course Completer', 'จบคอร์สแรก', '{"courses_completed": 1}', 'rare'),
('Point Collector', 'รวบรวมคะแนน 1,000 คะแนน', '{"total_points": 1000}', 'epic');