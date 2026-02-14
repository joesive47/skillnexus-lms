const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

console.log('Testing Prisma Client...')
console.log('Has notification delegate:', typeof prisma.notification !== 'undefined')
console.log('Notification methods:', prisma.notification ? Object.keys(Object.getPrototypeOf(prisma.notification)) : 'N/A')

// List all available models
console.log('\nAvailable Prisma models:')
const models = Object.keys(prisma).filter(key => 
  typeof prisma[key] === 'object' && 
  prisma[key] !== null &&
  typeof prisma[key].findMany === 'function'
)
console.log(models.sort())

prisma.$disconnect()
