import { prisma } from './prisma';

// Points System
export const POINT_VALUES = {
  LOGIN: 10,
  VIDEO_COMPLETE: 50,
  QUIZ_PASS: 100,
  QUIZ_PERFECT: 200,
  COURSE_START: 25,
  COURSE_COMPLETE: 500,
  STREAK_BONUS: 5, // per day
} as const;

// Badge Criteria
export const BADGE_CRITERIA = {
  FIRST_STEPS: { first_login: true },
  EARLY_BIRD: { login_streak: 3 },
  DEDICATED_LEARNER: { login_streak: 7 },
  STREAK_MASTER: { login_streak: 30 },
  VIDEO_WATCHER: { videos_completed: 1 },
  COURSE_STARTER: { courses_started: 1 },
  QUIZ_TAKER: { quizzes_taken: 1 },
  PERFECT_SCORE: { perfect_quiz: 1 },
  COURSE_COMPLETER: { courses_completed: 1 },
  POINT_COLLECTOR: { total_points: 1000 },
} as const;

// Award Points
export async function awardPoints(userId: string, activityType: keyof typeof POINT_VALUES, metadata?: any) {
  const points = POINT_VALUES[activityType];
  
  // Get or create user points record
  let userPoints = await prisma.$queryRaw`
    SELECT * FROM user_points WHERE user_id = ${userId}
  ` as any[];

  if (userPoints.length === 0) {
    await prisma.$executeRaw`
      INSERT INTO user_points (user_id, points, total_earned) 
      VALUES (${userId}, ${points}, ${points})
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE user_points 
      SET points = points + ${points}, 
          total_earned = total_earned + ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
  }

  // Log activity
  await prisma.$executeRaw`
    INSERT INTO activity_log (user_id, activity_type, points_earned, description, metadata)
    VALUES (${userId}, ${activityType}, ${points}, ${`Earned ${points} points for ${activityType}`}, ${JSON.stringify(metadata || {})})
  `;

  return points;
}

// Update Login Streak
export async function updateLoginStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const streak = await prisma.$queryRaw`
    SELECT * FROM login_streaks WHERE user_id = ${userId}
  ` as any[];

  if (streak.length === 0) {
    // First login
    await prisma.$executeRaw`
      INSERT INTO login_streaks (user_id, current_streak, longest_streak, last_login_date)
      VALUES (${userId}, 1, 1, ${today})
    `;
    await awardPoints(userId, 'LOGIN');
    await checkAndAwardBadge(userId, 'First Steps');
    return 1;
  }

  const lastLogin = streak[0].last_login_date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastLogin === today) {
    // Already logged in today
    return streak[0].current_streak;
  }

  let newStreak = 1;
  if (lastLogin === yesterdayStr) {
    // Consecutive day
    newStreak = streak[0].current_streak + 1;
  }

  const longestStreak = Math.max(newStreak, streak[0].longest_streak);

  await prisma.$executeRaw`
    UPDATE login_streaks 
    SET current_streak = ${newStreak},
        longest_streak = ${longestStreak},
        last_login_date = ${today},
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
  `;

  // Award points with streak bonus
  const basePoints = POINT_VALUES.LOGIN;
  const bonusPoints = Math.min(newStreak * POINT_VALUES.STREAK_BONUS, 100); // Cap at 100
  await awardPoints(userId, 'LOGIN');
  
  if (bonusPoints > 0) {
    await prisma.$executeRaw`
      UPDATE user_points 
      SET points = points + ${bonusPoints}, 
          total_earned = total_earned + ${bonusPoints}
      WHERE user_id = ${userId}
    `;
  }

  // Check for streak badges
  if (newStreak === 3) await checkAndAwardBadge(userId, 'Early Bird');
  if (newStreak === 7) await checkAndAwardBadge(userId, 'Dedicated Learner');
  if (newStreak === 30) await checkAndAwardBadge(userId, 'Streak Master');

  return newStreak;
}

// Check and Award Badge
export async function checkAndAwardBadge(userId: string, badgeName: string) {
  // Check if user already has this badge
  const existingBadge = await prisma.$queryRaw`
    SELECT ub.* FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId} AND b.name = ${badgeName}
  ` as any[];

  if (existingBadge.length > 0) return false;

  // Get badge info
  const badge = await prisma.$queryRaw`
    SELECT * FROM badges WHERE name = ${badgeName}
  ` as any[];

  if (badge.length === 0) return false;

  // Award badge
  await prisma.$executeRaw`
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (${userId}, ${badge[0].id})
  `;

  return true;
}

// Get User Stats
export async function getUserStats(userId: string) {
  const points = await prisma.$queryRaw`
    SELECT * FROM user_points WHERE user_id = ${userId}
  ` as any[];

  const streak = await prisma.$queryRaw`
    SELECT * FROM login_streaks WHERE user_id = ${userId}
  ` as any[];

  const badges = await prisma.$queryRaw`
    SELECT b.*, ub.earned_at FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
    ORDER BY ub.earned_at DESC
  ` as any[];

  return {
    points: points[0]?.points || 0,
    totalEarned: points[0]?.total_earned || 0,
    currentStreak: streak[0]?.current_streak || 0,
    longestStreak: streak[0]?.longest_streak || 0,
    badges: badges,
    badgeCount: badges.length
  };
}

// Track Video Completion
export async function trackVideoCompletion(userId: string, lessonId: string) {
  await awardPoints(userId, 'VIDEO_COMPLETE', { lessonId });
  
  // Check for video watcher badge
  const videoCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM watch_history 
    WHERE user_id = ${userId} AND completed = 1
  ` as any[];

  if (videoCount[0]?.count === 1) {
    await checkAndAwardBadge(userId, 'Video Watcher');
  }
}

// Track Quiz Completion
export async function trackQuizCompletion(userId: string, quizId: string, score: number, passed: boolean) {
  if (passed) {
    const points = score === 100 ? 'QUIZ_PERFECT' : 'QUIZ_PASS';
    await awardPoints(userId, points, { quizId, score });
    
    if (score === 100) {
      await checkAndAwardBadge(userId, 'Perfect Score');
    }
  }

  // Check for quiz taker badge
  const quizCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM student_submissions 
    WHERE user_id = ${userId}
  ` as any[];

  if (quizCount[0]?.count === 1) {
    await checkAndAwardBadge(userId, 'Quiz Taker');
  }
}

// Track Course Start
export async function trackCourseStart(userId: string, courseId: string) {
  await awardPoints(userId, 'COURSE_START', { courseId });
  
  const courseCount = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM enrollments 
    WHERE user_id = ${userId}
  ` as any[];

  if (courseCount[0]?.count === 1) {
    await checkAndAwardBadge(userId, 'Course Starter');
  }
}

// Track Course Completion
export async function trackCourseCompletion(userId: string, courseId: string) {
  await awardPoints(userId, 'COURSE_COMPLETE', { courseId });
  await checkAndAwardBadge(userId, 'Course Completer');
  
  // Check for point collector badge
  const stats = await getUserStats(userId);
  if (stats.totalEarned >= 1000) {
    await checkAndAwardBadge(userId, 'Point Collector');
  }
}