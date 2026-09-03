'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface ProgressBarProps {
  userId: string;
  courseId: string;
  className?: string;
}

interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  currentLesson?: {
    id: string;
    title: string;
    progress: number;
  };
  percentage: number;
}

export default function ProgressBar({ userId, courseId, className = '' }: ProgressBarProps) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [userId, courseId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/progress/${userId}`);
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-2 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">ความคืบหน้า</h3>
        <span className="text-sm font-medium text-blue-600">
          {progress.percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress.percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div 
          className="absolute top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform -translate-y-0.5 transition-all duration-500"
          style={{ left: `calc(${progress.percentage}% - 8px)` }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0.5 left-0.5"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>{progress.completedLessons} เสร็จแล้ว</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="w-4 h-4 text-gray-400" />
          <span>{progress.totalLessons - progress.completedLessons} เหลือ</span>
        </div>
      </div>

      {/* Current Lesson */}
      {progress.currentLesson && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">กำลังเรียน</span>
          </div>
          <p className="text-sm text-gray-700 mb-2 line-clamp-1">
            {progress.currentLesson.title}
          </p>
          
          {progress.currentLesson.progress > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.currentLesson.progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Completion Message */}
      {progress.percentage === 100 && (
        <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-green-800">
            🎉 เรียนจบแล้ว! ยินดีด้วย
          </p>
        </div>
      )}
    </div>
  );
}