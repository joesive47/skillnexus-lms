'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  createdAt: string
  paidAt?: string
  user: {
    name: string
    email: string
  }
  course?: {
    title: string
  }
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPayments()
  }, [page, statusFilter])

  const fetchPayments = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/payments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        fetchPayments()
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, icon: any, label: string }> = {
      'PENDING': { variant: 'secondary', icon: Clock, label: 'รอชำระ' },
      'PROCESSING': { variant: 'default', icon: Clock, label: 'กำลังดำเนินการ' },
      'COMPLETED': { variant: 'default', icon: CheckCircle, label: 'สำเร็จ' },
      'FAILED': { variant: 'destructive', icon: XCircle, label: 'ล้มเหลว' },
      'CANCELLED': { variant: 'secondary', icon: XCircle, label: 'ยกเลิก' },
      'REFUNDED': { variant: 'outline', icon: XCircle, label: 'คืนเงิน' }
    }
    
    const config = variants[status] || variants['PENDING']
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredPayments = payments.filter(payment =>
    payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ประวัติการชำระเงิน</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            ส่งออก
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อ, อีเมล, หรือคอร์ส..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="PENDING">รอชำระ</SelectItem>
              <SelectItem value="PROCESSING">กำลังดำเนินการ</SelectItem>
              <SelectItem value="COMPLETED">สำเร็จ</SelectItem>
              <SelectItem value="FAILED">ล้มเหลว</SelectItem>
              <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>คอร์ส</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>ช่องทาง</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.user.name}</p>
                      <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.course?.title || 'ไม่ระบุ'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodName(payment.paymentMethod)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{formatDate(payment.createdAt)}</p>
                      {payment.paidAt && (
                        <p className="text-xs text-green-600">
                          ชำระ: {formatDate(payment.paidAt)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePaymentStatus(payment.id, 'COMPLETED')}
                          >
                            อนุมัติ
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updatePaymentStatus(payment.id, 'FAILED')}
                          >
                            ปฏิเสธ
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!loading && filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">ไม่พบข้อมูลการชำระเงิน</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}