# 🛠️ Technical Implementation Specifications

## 📋 Database Schema Updates

### New Tables Required

```sql
-- Gamification Tables
CREATE TABLE user_points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  criteria JSONB,
  rarity ENUM('common', 'rare', 'epic', 'legendary'),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  badge_id INTEGER REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE login_streaks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Social Features
CREATE TABLE study_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  creator_id INTEGER REFERENCES users(id),
  max_members INTEGER DEFAULT 10,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE study_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES study_groups(id),
  user_id INTEGER REFERENCES users(id),
  role ENUM('member', 'moderator', 'admin') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE discussion_forums (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  forum_id INTEGER REFERENCES discussion_forums(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES forum_posts(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rewards System
CREATE TABLE virtual_currency (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  type ENUM('digital', 'physical', 'access'),
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reward_purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  reward_id INTEGER REFERENCES rewards(id),
  cost INTEGER NOT NULL,
  status ENUM('pending', 'fulfilled', 'cancelled') DEFAULT 'pending',
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API Endpoints

### Gamification APIs

```typescript
// Points System
GET    /api/users/{id}/points
POST   /api/users/{id}/points/award
GET    /api/leaderboard

// Badges
GET    /api/badges
GET    /api/users/{id}/badges
POST   /api/users/{id}/badges/award

// Streaks
GET    /api/users/{id}/streak
POST   /api/users/{id}/streak/update

// Social Features
GET    /api/study-groups
POST   /api/study-groups
GET    /api/study-groups/{id}/members
POST   /api/study-groups/{id}/join

// Forums
GET    /api/courses/{id}/forums
POST   /api/forums/{id}/posts
GET    /api/forums/{id}/posts

// Rewards
GET    /api/rewards
POST   /api/rewards/{id}/purchase
GET    /api/users/{id}/purchases
```

## 📱 Component Architecture

### New Components Structure

```
src/components/
├── gamification/
│   ├── PointsDisplay.tsx
│   ├── BadgeCollection.tsx
│   ├── StreakCounter.tsx
│   ├── Leaderboard.tsx
│   └── ProgressBar.tsx
├── social/
│   ├── StudyGroupCard.tsx
│   ├── ForumPost.tsx
│   ├── UserProfile.tsx
│   └── PeerList.tsx
├── rewards/
│   ├── RewardCard.tsx
│   ├── CurrencyDisplay.tsx
│   └── PurchaseHistory.tsx
└── notifications/
    ├── NotificationCenter.tsx
    ├── ToastNotification.tsx
    └── PushNotification.tsx
```

## 🎨 UI/UX Specifications

### Design System Updates

```css
/* New Color Palette */
:root {
  --color-gold: #FFD700;
  --color-silver: #C0C0C0;
  --color-bronze: #CD7F32;
  --color-success: #10B981;
  --color-streak: #F59E0B;
  --color-social: #3B82F6;
}

/* Animation Classes */
.badge-earned {
  animation: badgeEarn 0.8s ease-out;
}

.points-gained {
  animation: pointsGain 0.6s ease-out;
}

.streak-fire {
  animation: streakFlame 1s infinite alternate;
}

@keyframes badgeEarn {
  0% { transform: scale(0) rotate(180deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(0deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

## 🔔 Notification System

### Push Notification Setup

```typescript
// Service Worker for Push Notifications
// sw.js
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'เรียนต่อ',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'ปิด',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SkillNexus', options)
  );
});
```

## 📊 Analytics Implementation

### Event Tracking

```typescript
// Analytics Events
const trackingEvents = {
  // User Engagement
  'user_login': { category: 'engagement', action: 'login' },
  'course_start': { category: 'learning', action: 'course_start' },
  'video_complete': { category: 'learning', action: 'video_complete' },
  'quiz_attempt': { category: 'assessment', action: 'quiz_attempt' },
  
  // Gamification
  'points_earned': { category: 'gamification', action: 'points_earned' },
  'badge_unlocked': { category: 'gamification', action: 'badge_unlocked' },
  'streak_milestone': { category: 'gamification', action: 'streak_milestone' },
  
  // Social
  'group_joined': { category: 'social', action: 'group_joined' },
  'forum_post': { category: 'social', action: 'forum_post' },
  'peer_interaction': { category: 'social', action: 'peer_interaction' }
};
```

## 🚀 Performance Optimization

### Caching Strategy

```typescript
// Redis Caching Implementation
const cacheConfig = {
  // User data cache (5 minutes)
  userPoints: { ttl: 300, key: 'user:points:' },
  userBadges: { ttl: 300, key: 'user:badges:' },
  userStreak: { ttl: 300, key: 'user:streak:' },
  
  // Leaderboard cache (1 minute)
  leaderboard: { ttl: 60, key: 'leaderboard:global' },
  courseLeaderboard: { ttl: 60, key: 'leaderboard:course:' },
  
  // Social data cache (2 minutes)
  studyGroups: { ttl: 120, key: 'groups:user:' },
  forumPosts: { ttl: 120, key: 'forum:posts:' }
};
```

## 🔐 Security Considerations

### Data Protection

```typescript
// Input Validation
const validationRules = {
  points: {
    min: 0,
    max: 10000,
    type: 'integer'
  },
  groupName: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\u0E00-\u0E7F]+$/
  },
  forumPost: {
    minLength: 10,
    maxLength: 5000,
    sanitize: true
  }
};

// Rate Limiting
const rateLimits = {
  pointsAward: '10/hour',
  forumPost: '5/minute',
  groupJoin: '20/hour',
  badgeCheck: '100/minute'
};
```

## 📱 Mobile Optimization

### PWA Configuration

```json
// manifest.json
{
  "name": "SkillNexus LMS",
  "short_name": "SkillNexus",
  "description": "Global Learning Management System",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "My Courses",
      "short_name": "Courses",
      "description": "View my enrolled courses",
      "url": "/dashboard/courses",
      "icons": [{ "src": "/icons/courses.png", "sizes": "96x96" }]
    }
  ]
}
```

## 🧪 Testing Strategy

### Test Coverage Requirements

```typescript
// Unit Tests (80% coverage minimum)
describe('Gamification System', () => {
  test('should award points correctly', () => {});
  test('should unlock badges when criteria met', () => {});
  test('should calculate streaks accurately', () => {});
});

// Integration Tests
describe('Social Features', () => {
  test('should create study group successfully', () => {});
  test('should handle forum post creation', () => {});
  test('should manage group memberships', () => {});
});

// E2E Tests
describe('User Journey', () => {
  test('complete learning path with gamification', () => {});
  test('social interaction workflow', () => {});
  test('reward redemption process', () => {});
});
```

## 🔄 Migration Plan

### Database Migration Scripts

```sql
-- Migration 001: Add gamification tables
-- Migration 002: Add social features
-- Migration 003: Add rewards system
-- Migration 004: Add analytics tracking
-- Migration 005: Add notification preferences

-- Data Migration
INSERT INTO badges (name, description, criteria, rarity) VALUES
('First Steps', 'Complete your first lesson', '{"lessons_completed": 1}', 'common'),
('Dedicated Learner', 'Login for 7 consecutive days', '{"login_streak": 7}', 'rare'),
('Quiz Master', 'Score 100% on 5 quizzes', '{"perfect_quizzes": 5}', 'epic');
```

---

*Technical Specifications v1.0*
*Last Updated: December 2024*