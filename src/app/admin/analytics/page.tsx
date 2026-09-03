'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, TrendingUp, Activity, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  total: number;
  today: number;
  weekly: number;
  monthly: number;
  growth: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  charts: {
    hourly: Array<{ hour: number; visitors: number }>;
    daily: Array<{ day: string; visitors: number }>;
  };
}

export default function VisitorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/visitors');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Activity className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-white">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">ไม่สามารถโหลดข้อมูลได้</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📊 Visitor Analytics</h1>
          <p className="text-gray-400">สถิติผู้เข้าชมเว็บไซต์แบบเรียลไทม์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ผู้เข้าชมทั้งหมด</p>
                <p className="text-2xl font-bold text-white">{data.total.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">วันนี้</p>
                <p className="text-2xl font-bold text-white">{data.today.toLocaleString()}</p>
                <p className="text-green-400 text-sm">{data.growth.daily}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">สัปดาห์นี้</p>
                <p className="text-2xl font-bold text-white">{data.weekly.toLocaleString()}</p>
                <p className="text-green-400 text-sm">{data.growth.weekly}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">เดือนนี้</p>
                <p className="text-2xl font-bold text-white">{data.monthly.toLocaleString()}</p>
                <p className="text-green-400 text-sm">{data.growth.monthly}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">ผู้เข้าชมรายชั่วโมง (วันนี้)</h3>
            <div className="space-y-2">
              {data.charts.hourly.slice(0, 12).map((item) => (
                <div key={item.hour} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{item.hour}:00</span>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${(item.visitors / 60) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-8">{item.visitors}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">ผู้เข้าชมรายวัน (สัปดาห์นี้)</h3>
            <div className="space-y-2">
              {data.charts.daily.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm w-8">{item.day}</span>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{ width: `${(item.visitors / 300) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">{item.visitors}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm">อัพเดทแบบเรียลไทม์</span>
          </div>
        </div>
      </div>
    </div>
  );
}