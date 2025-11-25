'use client';

import { useState, useEffect } from 'react';
import { Target, Trophy, Clock, CheckCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  target_value: number;
  reward_points: number;
  current_progress?: number;
  completed?: boolean;
}

export default function DailyChallenge({ userId }: { userId: string }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayChallenge();
  }, [userId]);

  const fetchTodayChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/today/${userId}`);
      const data = await response.json();
      setChallenge(data);
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg p-4 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded mb-2"></div>
        <div className="h-4 bg-white/20 rounded mb-3"></div>
        <div className="h-2 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600">ไม่มีภารกิจวันนี้</p>
      </div>
    );
  }

  const progress = (challenge.current_progress || 0) / challenge.target_value * 100;
  const isCompleted = challenge.completed || progress >= 100;

  return (
    <div className={`rounded-lg p-4 text-white relative overflow-hidden ${
      isCompleted 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
        : 'bg-gradient-to-r from-orange-400 to-pink-500'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 text-6xl">🎯</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="font-semibold">ภารกิจวันนี้</span>
          </div>
          <div className="flex items-center gap-1 text-sm bg-white/20 rounded-full px-2 py-1">
            <Trophy className="w-4 h-4" />
            <span>{challenge.reward_points}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
        <p className="text-sm opacity-90 mb-4">{challenge.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>ความคืบหน้า</span>
            <span>{challenge.current_progress || 0}/{challenge.target_value}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        {isCompleted ? (
          <div className="flex items-center gap-2 mt-3 bg-white/20 rounded-lg p-2">
            <CheckCircle className="w-5 h-5 text-green-200" />
            <span className="font-medium">เสร็จสิ้นแล้ว! 🎉</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-3 text-sm opacity-80">
            <Clock className="w-4 h-4" />
            <span>เหลือเวลาถึงเที่ยงคืน</span>
          </div>
        )}
      </div>
    </div>
  );
}