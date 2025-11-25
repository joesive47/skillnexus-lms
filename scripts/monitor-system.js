#!/usr/bin/env node

const http = require('http')

const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:3000/api/health'
const CHECK_INTERVAL = 30000 // 30 seconds

async function checkHealth() {
  try {
    const response = await fetch(HEALTH_CHECK_URL)
    const data = await response.json()
    
    const timestamp = new Date().toISOString()
    
    if (response.status === 200 && data.status === 'healthy') {
      console.log(`[${timestamp}] ✅ System healthy - DB: ${data.services.database}, Memory: ${data.services.memory}`)
    } else if (data.status === 'degraded') {
      console.warn(`[${timestamp}] ⚠️  System degraded - DB: ${data.services.database}, Memory: ${data.services.memory}`)
    } else {
      console.error(`[${timestamp}] 🚨 System unhealthy - DB: ${data.services.database}, Memory: ${data.services.memory}`)
      
      // ส่งแจ้งเตือน (เพิ่มในอนาคต)
      // await sendAlert(data)
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Health check failed:`, error.message)
  }
}

// เริ่มต้น monitoring
console.log('🔍 Starting system monitoring...')
console.log(`📍 Health check URL: ${HEALTH_CHECK_URL}`)
console.log(`⏱️  Check interval: ${CHECK_INTERVAL / 1000}s`)

// ตรวจสอบทันที
checkHealth()

// ตรวจสอบเป็นระยะ
setInterval(checkHealth, CHECK_INTERVAL)

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping system monitoring...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping system monitoring...')
  process.exit(0)
})