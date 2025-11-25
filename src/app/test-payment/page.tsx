import { PaymentForm } from '@/components/payment/payment-form'

export const dynamic = 'force-dynamic'

export default function TestPaymentPage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ทดสอบระบบการชำระเงิน
      </h1>
      
      <PaymentForm
        courseId="test-course-id"
        amount={1990}
        courseName="คอร์สทดสอบระบบการชำระเงิน"
        onSuccess={() => {
          alert('การชำระเงินสำเร็จ!')
        }}
      />
    </div>
  )
}