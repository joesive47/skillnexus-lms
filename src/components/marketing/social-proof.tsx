'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Activity {
  name: string;
  action: string;
  time: string;
}

export default function SocialProof() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/marketing/recent-activity')
      .then(res => res.json())
      .then(data => setActivities(data));

    const timer = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  if (!visible || activities.length === 0) return null;

  const activity = activities[Math.floor(Math.random() * activities.length)];

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {activity.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.action}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {activity.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}