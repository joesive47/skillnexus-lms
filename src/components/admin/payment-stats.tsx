'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, CreditCard, Users, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface PaymentStats {
  totalRevenue: number
  monthlyRevenue: number
  totalPayments: number
  payingCustomers: number
  paymentMethods: Array<{
    paymentMethod: string
    _count: { _all: number }
    _sum: { amount: number }
  }>
}

export function PaymentStats() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/payments/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const getPaymentMethodName = (method: string) => {
    const names: Record<string, string> = {
      'CREDIT_CARD': 'บัตรเครดิต',
      'PROMPT_PAY': 'PromptPay',
      'BANK_TRANSFER': 'โอนธนาคาร',
      'MOBILE_BANKING': 'Mobile Banking',
      'TRUE_WALLET': 'TrueMoney'
    }
    return names[method] || method
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalRevenue) : '฿0'}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +12.5% จากเดือนที่แล้ว
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้เดือนนี้</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.monthlyRevenue) : '฿0'}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +8.2% จากเดือนที่แล้ว
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การชำระเงิน</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalPayments || 0}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +15 รายการใหม่
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้าที่ชำระแล้ว</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.payingCustomers || 0}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              +5 คนใหม่
            </div>
          </CardContent>
        </Card>
      </div>

      {stats?.paymentMethods && stats.paymentMethods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>สถิติช่องทางการชำระเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.paymentMethods.map((method) => (
                <div key={method.paymentMethod} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getPaymentMethodName(method.paymentMethod)}</p>
                    <p className="text-sm text-muted-foreground">
                      {method._count._all} รายการ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(method._sum.amount || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((method._sum.amount || 0) / (stats.totalRevenue || 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}