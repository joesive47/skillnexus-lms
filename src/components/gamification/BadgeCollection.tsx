'use client';

import { useState, useEffect } from 'react';
import { Award, Lock } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned_at?: string;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const RARITY_LABELS = {
  common: 'ธรรมดา',
  rare: 'หายาก',
  epic: 'เอพิค',
  legendary: 'ตำนาน'
};

export default function BadgeCollection({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const [userBadgesRes, allBadgesRes] = await Promise.all([
        fetch(`/api/gamification/badges/${userId}`),
        fetch('/api/gamification/badges')
      ]);
      
      const userBadges = await userBadgesRes.json();
      const allBadges = await allBadgesRes.json();
      
      setBadges(userBadges);
      setAllBadges(allBadges);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-1"></div>
            <div className="h-2 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  const earnedBadgeIds = new Set(badges.map(b => b.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          เหรียญรางวัล ({badges.length}/{allBadges.length})
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const earnedBadge = badges.find(b => b.id === badge.id);
          
          return (
            <div
              key={badge.id}
              className={`relative rounded-lg p-3 text-center transition-all duration-300 ${
                isEarned 
                  ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity]} text-white shadow-lg transform hover:scale-105`
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                isEarned ? 'bg-white/20' : 'bg-gray-300'
              }`}>
                {isEarned ? (
                  <Award className="w-6 h-6" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              
              <h4 className="font-semibold text-sm mb-1 truncate">
                {badge.name}
              </h4>
              
              <p className="text-xs opacity-80 mb-2 line-clamp-2">
                {badge.description}
              </p>
              
              <div className={`text-xs px-2 py-1 rounded-full ${
                isEarned 
                  ? 'bg-white/20' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {RARITY_LABELS[badge.rarity]}
              </div>
              
              {isEarned && earnedBadge?.earned_at && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {badges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีเหรียญรางวัล</p>
          <p className="text-sm">เริ่มเรียนเพื่อรับเหรียญแรกของคุณ!</p>
        </div>
      )}
    </div>
  );
}