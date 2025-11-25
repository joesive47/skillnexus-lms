'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, History } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
}

interface CreditBalanceProps {
  credits: number
  transactions: Transaction[]
}

export default function CreditBalance({ credits, transactions }: CreditBalanceProps) {
  const [showHistory, setShowHistory] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CREDIT_ADD':
        return 'text-green-600'
      case 'COURSE_PURCHASE':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">เครดิตของฉัน</CardTitle>
          <Coins className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{credits} เครดิต</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="mt-2"
          >
            <History className="h-4 w-4 mr-2" />
            {showHistory ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
          </Button>
        </CardContent>
      </Card>

      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ประวัติการใช้เครดิต</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground">ไม่มีประวัติการทำรายการ</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} เครดิต
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}