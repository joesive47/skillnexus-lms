'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PurchaseButtonProps {
  courseId: string;
  price: number;
  userCredits: number;
  isEnrolled: boolean;
}

export function PurchaseButton({ courseId, price, userCredits, isEnrolled }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (isEnrolled) {
      toast.info('คุณได้ลงทะเบียนหลักสูตรนี้แล้ว');
      return;
    }

    if (userCredits < price) {
      toast.error(`เครดิตไม่เพียงพอ (มี ฿${userCredits.toLocaleString('th-TH')} ต้องการ ฿${price.toLocaleString('th-TH')})`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการซื้อหลักสูตร');
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button disabled className="w-full">
        ✅ ลงทะเบียนแล้ว
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        เครดิตของคุณ: ฿{userCredits.toLocaleString('th-TH')} | ราคา: ฿{price.toLocaleString('th-TH')}
      </div>
      <Button 
        onClick={handlePurchase} 
        disabled={loading || userCredits < price}
        className="w-full"
      >
        {loading ? 'กำลังซื้อ...' : `ซื้อด้วยเครดิต (฿${price.toLocaleString('th-TH')})`}
      </Button>
    </div>
  );
}