'use client';

import { Shield, Lock, Award, Star, Users, Zap } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: Shield, text: 'ปลอดภัย 100%', color: 'text-blue-600' },
    { icon: Lock, text: 'ข้อมูลเข้ารหัส', color: 'text-green-600' },
    { icon: Award, text: 'ใบประกาศนียบัตร', color: 'text-purple-600' },
    { icon: Star, text: 'คุณภาพสูง', color: 'text-yellow-600' },
    { icon: Users, text: '10,000+ สมาชิก', color: 'text-pink-600' },
    { icon: Zap, text: 'เรียนได้ทันที', color: 'text-orange-600' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 py-8 border-y border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <badge.icon className={`w-5 h-5 ${badge.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}