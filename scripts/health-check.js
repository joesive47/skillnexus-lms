#!/usr/bin/env node

/**
 * Health Check Script
 * Checks if the application and database are healthy
 */

const https = require('https')
const http = require('http')

const url = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const healthEndpoint = `${url}/api/health`

console.log('🏥 Checking application health...')
console.log(`📍 URL: ${healthEndpoint}\n`)

const protocol = url.startsWith('https') ? https : http

protocol.get(healthEndpoint, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    try {
      const health = JSON.parse(data)
      
      console.log('📊 Health Check Results:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`\n🌐 Application`)
      console.log(`   Status: ${health.status === 'ok' ? '✅ OK' : '❌ ERROR'}`)
      console.log(`   Name: ${health.app?.name || 'N/A'}`)
      console.log(`   Version: ${health.app?.version || 'N/A'}`)
      console.log(`   Environment: ${health.app?.environment || 'N/A'}`)
      
      console.log(`\n💾 Database`)
      console.log(`   Status: ${health.database?.status === 'healthy' ? '✅ Healthy' : health.database?.status === 'degraded' ? '⚠️ Degraded' : '❌ Unhealthy'}`)
      console.log(`   Message: ${health.database?.message || 'N/A'}`)
      console.log(`   Latency: ${health.database?.latency || 'N/A'}ms`)
      
      console.log(`\n🕒 Timestamp: ${health.timestamp}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      // Exit with appropriate code
      if (health.status === 'ok') {
        console.log('✅ All systems operational!\n')
        process.exit(0)
      } else {
        console.log('❌ System health check failed!\n')
        process.exit(1)
      }
    } catch (error) {
      console.error('❌ Failed to parse health check response:', error.message)
      process.exit(1)
    }
  })
}).on('error', (error) => {
  console.error('❌ Health check request failed:', error.message)
  console.error('\n🔍 Possible causes:')
  console.error('   • Application is not running')
  console.error('   • Incorrect URL configuration')
  console.error('   • Network connectivity issues\n')
  process.exit(1)
})
