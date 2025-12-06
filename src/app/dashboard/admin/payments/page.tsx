import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types"
import { PaymentStats } from "@/components/admin/payment-stats"
import { PaymentHistory } from "@/components/admin/payment-history"
import { PaymentMethods } from "@/components/admin/payment-methods"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PaymentsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          จัดการการเงิน
        </h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="history">ประวัติการชำระ</TabsTrigger>
          <TabsTrigger value="methods">ช่องทางการชำระ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PaymentStats />
        </TabsContent>

        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="methods">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  )
}