'use client';

import { useEffect, useState } from 'react';
import { X, Gift } from 'lucide-react';

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('promoPopupSeen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem('promoPopupSeen', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 relative animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🎉 ยินดีต้อนรับ!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            รับส่วนลด <span className="text-3xl font-bold text-purple-600">50%</span> สำหรับคอร์สแรก!
          </p>

          <div className="space-y-3">
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              รับส่วนลดเลย!
            </button>
            <button
              onClick={handleClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm"
            >
              ไว้ทีหลัง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}