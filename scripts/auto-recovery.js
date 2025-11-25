#!/usr/bin/env node

const { exec } = require('child_process')

class AutoRecovery {
  static async checkHealth() {
    try {
      const response = await fetch('http://localhost:3000/api/health')
      const health = await response.json()
      
      if (health.status !== 'ok') {
        console.log('🚨 System unhealthy, attempting recovery...')
        await this.recover()
      } else {
        console.log('✅ System healthy')
      }
    } catch (error) {
      console.log('❌ Health check failed, attempting recovery...')
      await this.recover()
    }
  }

  static async recover() {
    const steps = [
      'npm run db:generate',
      'npm run db:push',
      'pm2 restart skillnexus || npm run dev'
    ]

    for (const step of steps) {
      try {
        console.log(`Executing: ${step}`)
        await this.execPromise(step)
        console.log(`✅ ${step} completed`)
      } catch (error) {
        console.log(`❌ ${step} failed:`, error.message)
      }
    }
  }

  static execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error)
        else resolve(stdout)
      })
    })
  }
}

// Run every 5 minutes
setInterval(() => AutoRecovery.checkHealth(), 5 * 60 * 1000)
AutoRecovery.checkHealth() // Run immediately