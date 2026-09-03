'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Coins, Star, BookOpen, Palette, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface StoreItem {
  id: string
  title: string
  description: string
  type: string
  cost: number
  imageUrl?: string
  isActive: boolean
}

export default function CreditStore({ userId, userCredits }: { userId: string, userCredits: number }) {
  const [items, setItems] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    loadStoreItems()
  }, [])

  const loadStoreItems = async () => {
    try {
      const response = await fetch('/api/store/items')
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to load store items:', error)
    } finally {
      setLoading(false)
    }
  }

  const purchaseItem = async (itemId: string, cost: number) => {
    if (userCredits < cost) {
      alert('ไม่มี Credits เพียงพอ!')
      return
    }

    setPurchasing(itemId)
    try {
      const response = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId })
      })
      
      if (response.ok) {
        alert('ซื้อสำเร็จ! 🎉')
        // Refresh user credits in parent component
        window.location.reload()
      } else {
        alert('เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setPurchasing(null)
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-6 h-6" />
      case 'feature': return <Zap className="w-6 h-6" />
      case 'cosmetic': return <Palette className="w-6 h-6" />
      default: return <Star className="w-6 h-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-700'
      case 'feature': return 'bg-purple-100 text-purple-700'
      case 'cosmetic': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading store...</div>
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-600" />
            🏪 Credit Store
          </CardTitle>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-yellow-600">{userCredits}</span>
            <span className="text-sm text-gray-600">Credits</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-orange-200 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
                  {getItemIcon(item.type)}
                </div>
                <Badge variant="outline" className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </div>

              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-orange-600 font-bold">
                  <Coins className="w-4 h-4" />
                  {item.cost}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => purchaseItem(item.id, item.cost)}
                  disabled={userCredits < item.cost || purchasing === item.id}
                  className={`${
                    userCredits >= item.cost 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {purchasing === item.id ? 'กำลังซื้อ...' : 'ซื้อ'}
                </Button>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>ไม่มีสินค้าในร้านค้า</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}