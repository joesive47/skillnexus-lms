'use client';

import { useEffect, useState } from 'react';
import { Users, Eye, BookOpen, Award } from 'lucide-react';

interface Stats {
  visitors: number;
  members: number;
  courses: number;
  certificates: number;
}

export default function LiveStatsCounter() {
  const [stats, setStats] = useState<Stats>({
    visitors: 0,
    members: 0,
    courses: 0,
    certificates: 0,
  });

  useEffect(() => {
    // Fetch real stats
    fetch('/api/marketing/stats')
      .then(res => res.json())
      .then(data => {
        animateValue('visitors', 0, data.visitors, 2000);
        animateValue('members', 0, data.members, 2000);
        animateValue('courses', 0, data.courses, 2000);
        animateValue('certificates', 0, data.certificates, 2000);
      });
  }, []);

  const animateValue = (key: keyof Stats, start: number, end: number, duration: number) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, 16);
  };

  const statItems = [
    { icon: Eye, label: 'ผู้เข้าชมทั้งหมด', value: stats.visitors, color: 'text-blue-600' },
    { icon: Users, label: 'สมาชิก', value: stats.members, color: 'text-green-600' },
    { icon: BookOpen, label: 'คอร์สเรียน', value: stats.courses, color: 'text-purple-600' },
    { icon: Award, label: 'ใบประกาศนียบัตร', value: stats.certificates, color: 'text-orange-600' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <item.icon className={`w-10 h-10 ${item.color}`} />
              </div>
              <div className={`text-4xl font-bold ${item.color} mb-2`}>
                {item.value.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}