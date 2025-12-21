"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ============================================
// BADGE ACTIONS
// ============================================

export async function createBadge(data: {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  points?: number;
  criteria?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.badge.create({ data });
}

export async function getUserBadges(userId: string) {
  return await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

export async function checkBadgeEligibility(userId: string, badgeId: string) {
  // Check if user already has this badge
  const existingBadge = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });

  if (existingBadge) return { eligible: false, reason: "Already earned" };

  // Get badge criteria
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge) return { eligible: false, reason: "Badge not found" };

  // Simple eligibility check - can be expanded based on criteria
  return { eligible: true, reason: "Eligible to earn" };
}

// ============================================
// ACHIEVEMENT ACTIONS
// ============================================

export async function createAchievement(data: {
  name: string;
  description: string;
  icon?: string;
  xpReward?: number;
  badgeReward?: string;
  requirementType: string;
  requirementValue: number;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.achievement.create({ data });
}

export async function getUserAchievements(userId: string) {
  return await prisma.userAchievementNew.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });
}

export async function getAchievementProgress(userId: string, achievementId: string) {
  const userAchievement = await prisma.userAchievementNew.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
    include: { achievement: true },
  });

  if (!userAchievement) {
    const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } });
    return { progress: 0, target: achievement?.requirementValue || 0, completed: false };
  }

  return {
    progress: userAchievement.progress,
    target: userAchievement.achievement.requirementValue,
    completed: userAchievement.progress >= userAchievement.achievement.requirementValue,
  };
}

export async function getAllAchievements() {
  return await prisma.achievement.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ============================================
// GAMIFICATION ACTIONS
// ============================================

export async function awardBadge(userId: string, badgeId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  // Check if user already has this badge
  const existingBadge = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });

  if (existingBadge) throw new Error("User already has this badge");

  return await prisma.userBadge.create({
    data: { userId, badgeId },
  });
}

export async function unlockAchievement(userId: string, achievementId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } });
  if (!achievement) throw new Error("Achievement not found");

  return await prisma.userAchievementNew.upsert({
    where: { userId_achievementId: { userId, achievementId } },
    update: { progress: achievement.requirementValue },
    create: {
      userId,
      achievementId,
      progress: achievement.requirementValue,
    },
  });
}

// ============================================
// ADMIN ACTIONS
// ============================================

export async function getAllBadges() {
  return await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBadge(badgeId: string, data: Partial<{
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  criteria: string;
  isActive: boolean;
}>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.badge.update({
    where: { id: badgeId },
    data,
  });
}

export async function deleteBadge(badgeId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.badge.update({
    where: { id: badgeId },
    data: { isActive: false },
  });
}