import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { prisma } from "@/lib/prisma"
import CreditManager from "@/components/admin/CreditManager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users, TrendingUp } from "lucide-react"

export default async function AdminCreditsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      credits: true
    },
    orderBy: { name: 'asc' }
  })

  const usersWithNames = users.map(user => ({
    ...user,
    name: user.name || 'Unknown User'
  }))

  const totalCredits = usersWithNames.reduce((sum, user) => sum + user.credits, 0)
  const avgCredits = usersWithNames.length > 0 ? Math.round(totalCredits / usersWithNames.length) : 0

  const recentTransactions = await prisma.transaction.findMany({
    where: { type: { in: ['CREDIT_ADD', 'COURSE_PURCHASE'] } },
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">จัดการเครดิต</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เครดิตรวมในระบบ</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนนักเรียน</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersWithNames.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เครดิตเฉลี่ย</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCredits}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Manager */}
        <CreditManager 
          users={usersWithNames} 
          onCreditsUpdated={() => window.location.reload()} 
        />

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>รายการล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.user.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}