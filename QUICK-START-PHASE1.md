# 🚀 Quick Start Phase 1 - Addictive Features

## ⚡ เริ่มต้นใน 10 นาที!

### 1. Install Dependencies
```bash
npm install framer-motion redis ioredis
```

### 2. Update Database Schema
```bash
# เพิ่มใน prisma/schema.prisma
model UserReward {
  id          String   @id @default(cuid())
  userId      String
  rewardType  String   // 'daily_login', 'streak', 'achievement'
  rewardValue Int
  streakDay   Int?     @default(1)
  claimedAt   DateTime @default(now())
  
  @@map("user_rewards")
}

model Achievement {
  id              String @id @default(cuid())
  name            String @unique
  description     String
  icon            String?
  xpReward        Int    @default(0)
  badgeReward     String?
  requirementType String // 'login_streak', 'course_complete'
  requirementValue Int
  
  userAchievements UserAchievement[]
  @@map("achievements")
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
  progress      Int      @default(0)
  
  achievement Achievement @relation(fields: [achievementId], references: [id])
  @@map("user_achievements")
}

model UserXPLog {
  id        String   @id @default(cuid())
  userId    String
  xpGained  Int
  source    String   // 'lesson_complete', 'quiz_pass', 'daily_login'
  sourceId  String?
  createdAt DateTime @default(now())
  
  @@map("user_xp_log")
}
```

### 3. Push Database Changes
```bash
npx prisma generate
npx prisma db push
```

### 4. Test Rewards System
```bash
# เพิ่มใน dashboard
import RewardPopup from '@/components/rewards/RewardPopup'
import RewardsSystem from '@/lib/rewards-system'

// ใช้งาน
const claimReward = async () => {
  const result = await fetch('/api/rewards/daily-claim', { method: 'POST' })
  const data = await result.json()
  
  if (data.success) {
    setShowReward(true)
    setRewardData(data.reward)
  }
}
```

## 🎯 ทดสอบฟีเจอร์

### Daily Login Rewards
- เข้าสู่ระบบทุกวัน = รับ XP + Credits
- Streak 7 วัน = Badge + 2x Multiplier
- Streak 30 วัน = Premium Access

### XP System
- เรียนบทเรียน = +50 XP
- ผ่าน Quiz = +100 XP  
- Daily Login = +10-500 XP (ตาม streak)

### Achievement System
- Level 5 = "Rising Star" Badge
- Level 10 = "Dedicated Learner" Badge
- 7-Day Streak = "Week Warrior" Badge

## 📊 Expected Results (Week 1)

- **Daily Active Users**: +50%
- **Session Duration**: +30% 
- **Return Rate**: +40%
- **User Engagement**: +60%

## 🎮 Next Steps (Phase 2)

1. **Social Features**: Leaderboards, Study Buddies
2. **Advanced Gamification**: Challenges, Competitions
3. **Mobile Optimization**: PWA, Offline Mode
4. **AI Personalization**: Smart Recommendations

---

**🎉 Phase 1 จะทำให้ SkillNexus เปลี่ยนจาก Learning Platform เป็น Addictive Game!** 🚀