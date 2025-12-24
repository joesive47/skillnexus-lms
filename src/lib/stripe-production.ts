import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function createPaymentIntent(amount: number, currency = 'thb') {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to satang
    currency,
    automatic_payment_methods: { enabled: true }
  })
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent']
  })
}

export async function createCustomer(email: string, name: string) {
  return await stripe.customers.create({ email, name })
}

export { stripe }