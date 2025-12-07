import prisma from './prisma'

export async function testDatabaseConnection() {
  try {
    console.log('[DB TEST] Testing database connection...')
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('[DB TEST] ✅ Database connection successful')
    
    // Test user table
    const userCount = await prisma.user.count()
    console.log(`[DB TEST] ✅ User table accessible (${userCount} users)`)
    
    // Test specific test accounts
    const testAccounts = [
      'admin@skillnexus.com',
      'teacher@skillnexus.com', 
      'student@skillnexus.com'
    ]
    
    for (const email of testAccounts) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { email: true, role: true }
      })
      
      if (user) {
        console.log(`[DB TEST] ✅ Found ${user.role}: ${user.email}`)
      } else {
        console.log(`[DB TEST] ❌ Missing account: ${email}`)
      }
    }
    
    return { success: true, message: 'Database connection successful' }
  } catch (error) {
    console.error('[DB TEST] ❌ Database connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}