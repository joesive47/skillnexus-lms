'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Flame } from 'lucide-react';

interface UserStats {
  points: number;
  totalEarned: number;
  currentStreak: number;
  longestStreak: number;
  badges: any[];
  badgeCount: number;
}

export default function PointsDisplay({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/gamification/stats/${userId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-300" />
          <span className="font-bold text-lg">{stats.points.toLocaleString()}</span>
          <span className="text-sm opacity-80">คะแนน</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-300" />
          <span className="font-semibold">{stats.currentStreak}</span>
          <span className="text-xs opacity-80">วัน</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm opacity-90">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          <span>{stats.badgeCount} เหรียญ</span>
        </div>
        <div>
          รวม {stats.totalEarned.toLocaleString()} คะแนน
        </div>
      </div>
      
      {stats.currentStreak > 0 && (
        <div className="mt-2 text-xs bg-white/10 rounded px-2 py-1">
          🔥 เข้าระบบต่อเนื่อง {stats.currentStreak} วัน!
        </div>
      )}
    </div>
  );
}