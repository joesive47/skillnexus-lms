'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ amount, planName }: { amount: number, planName: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    try {
      const { data } = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, planType: planName })
      }).then(res => res.json())

      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      })

      if (error) {
        console.error('Payment failed:', error)
      } else {
        alert('ชำระเงินสำเร็จ! ยินดีต้อนรับสู่ SkillNexus LMS')
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Payment error:', error)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#424770' }
          }
        }} />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? 'กำลังประมวลผล...' : `ชำระเงิน ${amount.toLocaleString()} บาท`}
      </Button>
    </form>
  )
}

export default function ProductionPayment({ amount, planName }: { amount: number, planName: string }) {
  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">ชำระเงิน - {planName}</h2>
        <PaymentForm amount={amount} planName={planName} />
      </div>
    </Elements>
  )
}