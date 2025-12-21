/**
 * Integration Hooks - Connect certification system to existing LMS features
 * 
 * Add these hooks to existing quiz/assessment submission handlers
 */

import { BadgeEngine } from "@/lib/certification/badge-engine";
import { CertificationEngine } from "@/lib/certification/certification-engine";

// ============================================
// HOOK 1: Quiz Submission
// ============================================
// Add to: src/app/actions/quiz-actions.ts or wherever quiz submission is handled

export async function onQuizSubmitted(userId: string, quizId: string, score: number, passed: boolean) {
  if (!passed) return;

  // Auto-check and issue badges
  await BadgeEngine.checkAndIssueBadges(userId, "QUIZ", quizId);
}

// Example integration:
/*
export async function submitQuiz(userId: string, quizId: string, answers: any) {
  // ... existing quiz submission logic ...
  
  const submission = await db.studentSubmission.create({
    data: { userId, quizId, score, passed, answers: JSON.stringify(answers) }
  });
  
  // 🆕 ADD THIS LINE
  await onQuizSubmitted(userId, quizId, score, passed);
  
  return submission;
}
*/

// ============================================
// HOOK 2: Assessment Completion
// ============================================
// Add to: src/app/actions/assessment-actions.ts

export async function onAssessmentCompleted(userId: string, assessmentId: string, percentage: number) {
  // Auto-check and issue badges
  await BadgeEngine.checkAndIssueBadges(userId, "ASSESSMENT", assessmentId);
}

// Example integration:
/*
export async function submitAssessment(userId: string, careerId: string, answers: any) {
  // ... existing assessment logic ...
  
  const result = await db.assessmentResult.create({
    data: { userId, careerId, totalScore, percentage, answers: JSON.stringify(answers) }
  });
  
  // 🆕 ADD THIS LINE
  await onAssessmentCompleted(userId, careerId, percentage);
  
  return result;
}
*/

// ============================================
// HOOK 3: Course Completion
// ============================================
// Add to: src/app/actions/course-actions.ts

export async function onCourseCompleted(userId: string, courseId: string, totalHours: number) {
  // Auto-check and issue badges based on hours
  await BadgeEngine.checkAndIssueBadges(userId, "COURSE", courseId);
}

// ============================================
// HOOK 4: Badge Earned (Auto-check Certifications)
// ============================================
// This is automatically called by BadgeEngine.issueBadge()
// No manual integration needed

export async function onBadgeEarned(userId: string, badgeId: string) {
  // Auto-check and issue certifications
  await CertificationEngine.checkAndIssueCertifications(userId);
}

// ============================================
// HOOK 5: Manual Badge Issuance (Admin)
// ============================================

export async function manuallyIssueBadge(userId: string, badgeId: string, reason: string) {
  const evidence = { type: "MANUAL", reason };
  const userBadgeId = await BadgeEngine.issueBadge(userId, badgeId, evidence);
  
  if (userBadgeId) {
    // Auto-check certifications
    await CertificationEngine.checkAndIssueCertifications(userId);
  }
  
  return userBadgeId;
}

// ============================================
// CRON JOBS
// ============================================
// Add to: src/app/api/cron/route.ts or use Vercel Cron

import { EventProcessor } from "@/lib/certification/event-processor";

// Run every 5 minutes
export async function processEvents() {
  await EventProcessor.processPendingEvents();
}

// Run daily at 00:00 UTC
export async function checkExpirations() {
  await EventProcessor.checkExpirations();
}

// Example Vercel Cron configuration (vercel.json):
/*
{
  "crons": [
    {
      "path": "/api/cron/process-events",
      "schedule": "0/5 * * * *"
    },
    {
      "path": "/api/cron/check-expirations",
      "schedule": "0 0 * * *"
    }
  ]
}
*/
