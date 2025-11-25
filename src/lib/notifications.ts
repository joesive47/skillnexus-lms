import { prisma } from './prisma';

export interface NotificationData {
  userId: string;
  templateName?: string;
  title: string;
  message: string;
  type?: 'achievement' | 'reminder' | 'streak' | 'course' | 'quiz';
  icon?: string;
  actionUrl?: string;
  metadata?: any;
}

// Create notification
export async function createNotification(data: NotificationData) {
  const template = data.templateName ? await prisma.$queryRaw`
    SELECT * FROM notification_templates WHERE name = ${data.templateName} AND is_active = 1
  ` as any[] : null;

  await prisma.$executeRaw`
    INSERT INTO user_notifications (user_id, template_id, title, message, type, icon, action_url, metadata)
    VALUES (${data.userId}, ${template?.[0]?.id || null}, ${data.title}, ${data.message}, 
            ${data.type || 'reminder'}, ${data.icon || '📢'}, ${data.actionUrl || null}, 
            ${JSON.stringify(data.metadata || {})})
  `;
}

// Get user notifications
export async function getUserNotifications(userId: string, limit = 20) {
  return await prisma.$queryRaw`
    SELECT * FROM user_notifications 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  ` as any[];
}

// Mark as read
export async function markAsRead(notificationId: string) {
  await prisma.$executeRaw`
    UPDATE user_notifications 
    SET is_read = 1, read_at = CURRENT_TIMESTAMP 
    WHERE id = ${notificationId}
  `;
}

// Send achievement notification
export async function notifyAchievement(userId: string, type: 'badge' | 'streak' | 'points', data: any) {
  const templates = {
    badge: {
      title: 'ได้เหรียญใหม่! 🏆',
      message: `คุณได้รับเหรียญ "${data.badgeName}"`,
      icon: '🏆'
    },
    streak: {
      title: 'Streak ใหม่! 🔥',
      message: `คุณเข้าระบบต่อเนื่อง ${data.streak} วันแล้ว!`,
      icon: '🔥'
    },
    points: {
      title: 'ได้คะแนน! ⭐',
      message: `คุณได้รับ ${data.points} คะแนน`,
      icon: '⭐'
    }
  };

  const template = templates[type];
  await createNotification({
    userId,
    ...template,
    type: 'achievement',
    metadata: data
  });
}

// Daily challenge system
export async function getTodayChallenge() {
  const today = new Date().toISOString().split('T')[0];
  return await prisma.$queryRaw`
    SELECT * FROM daily_challenges 
    WHERE date = ${today} AND is_active = 1
    LIMIT 1
  ` as any[];
}

export async function getUserChallengeProgress(userId: string, challengeId: string) {
  return await prisma.$queryRaw`
    SELECT * FROM user_challenge_progress 
    WHERE user_id = ${userId} AND challenge_id = ${challengeId}
  ` as any[];
}

export async function updateChallengeProgress(userId: string, challengeId: string, progress: number) {
  const existing = await getUserChallengeProgress(userId, challengeId);
  
  if (existing.length === 0) {
    await prisma.$executeRaw`
      INSERT INTO user_challenge_progress (user_id, challenge_id, current_progress)
      VALUES (${userId}, ${challengeId}, ${progress})
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE user_challenge_progress 
      SET current_progress = ${progress}
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `;
  }

  // Check if challenge completed
  const challenge = await prisma.$queryRaw`
    SELECT * FROM daily_challenges WHERE id = ${challengeId}
  ` as any[];

  if (challenge[0] && progress >= challenge[0].target_value) {
    await prisma.$executeRaw`
      UPDATE user_challenge_progress 
      SET completed = 1, completed_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND challenge_id = ${challengeId}
    `;

    // Award points
    await prisma.$executeRaw`
      UPDATE user_points 
      SET points = points + ${challenge[0].reward_points},
          total_earned = total_earned + ${challenge[0].reward_points}
      WHERE user_id = ${userId}
    `;

    // Notify completion
    await createNotification({
      userId,
      title: 'ภารกิจสำเร็จ! 🎯',
      message: `คุณทำภารกิจ "${challenge[0].title}" สำเร็จแล้ว! ได้ ${challenge[0].reward_points} คะแนน`,
      type: 'achievement',
      icon: '🎯'
    });
  }
}