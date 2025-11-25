import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPaymentMethods() {
  console.log('🔄 Seeding payment methods...')

  const paymentMethods = [
    {
      name: 'บัตรเครดิต/เดบิต',
      type: 'CREDIT_CARD',
      isActive: true,
      description: 'Visa, Mastercard, JCB',
      config: JSON.stringify({
        fees: '2.9% + ฿10',
        instant: true,
        currencies: ['THB', 'USD']
      })
    },
    {
      name: 'PromptPay',
      type: 'PROMPT_PAY',
      isActive: true,
      description: 'สแกน QR Code ผ่านแอปธนาคาร',
      config: JSON.stringify({
        fees: '฿5',
        instant: true,
        currencies: ['THB']
      })
    },
    {
      name: 'โอนเงินผ่านธนาคาร',
      type: 'BANK_TRANSFER',
      isActive: true,
      description: 'โอนเงินเข้าบัญชีธนาคาร',
      config: JSON.stringify({
        fees: 'ฟรี',
        instant: false,
        currencies: ['THB'],
        bankDetails: {
          bankName: 'ธนาคารกสิกรไทย',
          accountNumber: '123-4-56789-0',
          accountName: 'SkillNexus Co., Ltd.'
        }
      })
    },
    {
      name: 'Mobile Banking',
      type: 'MOBILE_BANKING',
      isActive: false,
      description: 'แอปธนาคารมือถือ',
      config: JSON.stringify({
        fees: '฿3',
        instant: true,
        currencies: ['THB']
      })
    },
    {
      name: 'TrueMoney Wallet',
      type: 'TRUE_WALLET',
      isActive: false,
      description: 'กระเป๋าเงินอิเล็กทรอนิกส์',
      config: JSON.stringify({
        fees: '1.5% + ฿2',
        instant: true,
        currencies: ['THB']
      })
    }
  ]

  // Clear existing payment methods
  await prisma.paymentMethodConfig.deleteMany({})
  
  for (const method of paymentMethods) {
    await prisma.paymentMethodConfig.create({
      data: method
    })
  }

  console.log('✅ Payment methods seeded successfully!')
}

async function seedTestPayments() {
  console.log('🔄 Seeding test payments...')

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@skillnexus.com' }
  })

  if (!adminUser) {
    console.log('❌ Admin user not found, skipping test payments')
    return
  }

  // Get first course
  const course = await prisma.course.findFirst()

  if (!course) {
    console.log('❌ No courses found, skipping test payments')
    return
  }

  const testPayments = [
    {
      userId: adminUser.id,
      courseId: course.id,
      amount: 1990,
      currency: 'THB',
      status: 'COMPLETED',
      paymentMethod: 'CREDIT_CARD',
      description: 'ทดสอบการชำระเงินด้วยบัตรเครดิต',
      paidAt: new Date(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      userId: adminUser.id,
      courseId: course.id,
      amount: 2990,
      currency: 'THB',
      status: 'COMPLETED',
      paymentMethod: 'PROMPT_PAY',
      description: 'ทดสอบการชำระเงินด้วย PromptPay',
      paidAt: new Date(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      userId: adminUser.id,
      courseId: course.id,
      amount: 1500,
      currency: 'THB',
      status: 'PENDING',
      paymentMethod: 'BANK_TRANSFER',
      description: 'ทดสอบการชำระเงินด้วยการโอนธนาคาร',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24 hours
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]

  for (const payment of testPayments) {
    await prisma.payment.create({
      data: payment
    })
  }

  console.log('✅ Test payments seeded successfully!')
}

async function main() {
  try {
    await seedPaymentMethods()
    await seedTestPayments()
  } catch (error) {
    console.error('❌ Error seeding payment data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()