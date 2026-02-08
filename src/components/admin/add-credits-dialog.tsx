'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addUserCredits } from '@/app/actions/credits'
import { toast } from 'sonner'
import { Coins, Loader2 } from 'lucide-react'

interface AddCreditsDialogProps {
  userId: string
  userName: string
  userEmail: string
  currentCredits: number
  onSuccess?: () => void
}

export function AddCreditsDialog({ 
  userId, 
  userName, 
  userEmail, 
  currentCredits,
  onSuccess 
}: AddCreditsDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const creditAmount = parseInt(amount)
    if (!creditAmount || creditAmount <= 0) {
      toast.error('กรุณากรอกจำนวนเครดิตที่ถูกต้อง')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await addUserCredits(userId, creditAmount, description)
      
      if (result.success) {
        toast.success(result.message || 'เพิ่มเครดิตสำเร็จ')
        setOpen(false)
        setAmount('')
        setDescription('')
        onSuccess?.()
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเพิ่มเครดิต')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Coins className="w-4 h-4 mr-2" />
          เพิ่มเครดิต
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>เพิ่มเครดิตให้ผู้ใช้</DialogTitle>
            <DialogDescription>
              เพิ่มเครดิตให้ {userName || userEmail}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ยอดเครดิตปัจจุบัน</Label>
              <div className="text-2xl font-bold text-green-600">
                {currentCredits.toLocaleString('th-TH')} เครดิต
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">จำนวนเครดิตที่ต้องการเพิ่ม *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                placeholder="เช่น 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">หมายเหตุ (ไม่จำเป็น)</Label>
              <Textarea
                id="description"
                placeholder="เช่น โบนัสเดือนมกราคม, เติมเงินครั้งแรก"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {amount && parseInt(amount) > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 font-medium">
                  ยอดเครดิตใหม่จะเป็น:{' '}
                  {(currentCredits + parseInt(amount)).toLocaleString('th-TH')} เครดิต
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังเพิ่ม...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  เพิ่มเครดิต
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
