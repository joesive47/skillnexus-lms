import { 
  awardPoints, 
  updateLoginStreak, 
  trackVideoCompletion as baseTrackVideo,
  trackQuizCompletion as baseTrackQuiz 
} from './gamification-phase1';
import { 
  notifyAchievement, 
  getTodayChallenge, 
  updateChallengeProgress 
} from './notifications';

// Enhanced tracking with notifications and challenges
export async function trackVideoCompletion(userId: string, lessonId: string) {
  // Base tracking
  await baseTrackVideo(userId, lessonId);
  
  // Update daily challenge
  const challenges = await getTodayChallenge();
  if (challenges.length > 0 && challenges[0].type === 'video') {
    const currentProgress = await updateChallengeProgress(userId, challenges[0].id, 1);
  }
  
  // Notify points earned
  await notifyAchievement(userId, 'points', { points: 50, activity: 'video_complete' });
}

export async function trackQuizCompletion(userId: string, quizId: string, score: number, passed: boolean) {
  // Base tracking
  await baseTrackQuiz(userId, quizId, score, passed);
  
  if (passed) {
    // Update daily challenge
    const challenges = await getTodayChallenge();
    if (challenges.length > 0 && challenges[0].type === 'quiz') {
      await updateChallengeProgress(userId, challenges[0].id, 1);
    }
    
    // Notify achievement
    const points = score === 100 ? 200 : 100;
    await notifyAchievement(userId, 'points', { points, activity: 'quiz_complete', score });
  }
}

export async function trackLogin(userId: string) {
  // Update streak and get new streak value
  const newStreak = await updateLoginStreak(userId);
  
  // Update daily challenge
  const challenges = await getTodayChallenge();
  if (challenges.length > 0 && challenges[0].type === 'streak') {
    await updateChallengeProgress(userId, challenges[0].id, 1);
  }
  
  // Notify streak milestones
  if (newStreak === 3 || newStreak === 7 || newStreak === 30 || newStreak % 10 === 0) {
    await notifyAchievement(userId, 'streak', { streak: newStreak });
  }
  
  return newStreak;
}