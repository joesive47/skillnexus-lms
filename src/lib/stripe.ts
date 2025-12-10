import Stripe from 'stripe'

// Fallback for missing Stripe key during build
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
})

// Check if Stripe is properly configured
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY

export async function createPaymentIntent(amount: number, courseId: string, userId: string) {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to satang (THB cents)
    currency: 'thb',
    metadata: {
      courseId,
      userId,
    },
    payment_method_types: ['card', 'promptpay'],
  })
}

export async function createPromptPayPayment(amount: number, courseId: string, userId: string) {
  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'thb',
    payment_method_types: ['promptpay'],
    metadata: {
      courseId,
      userId,
    },
  })
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  })
}