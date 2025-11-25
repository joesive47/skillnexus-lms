import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log(`
🚀 Starting SkillNexus LMS Demo

📚 Features Available:
   ✅ Video Player with Anti-Skip Technology
   ✅ Interactive Quiz System
   ✅ Progress Tracking
   ✅ Certificate Generation
   ✅ Course Management

👤 Demo Accounts:
   📧 Admin: admin@skillnexus.com / admin123
   📧 Student: student@skillnexus.com / student123

🎯 Sample Course Created:
   📖 JavaScript Fundamentals
   🎬 3 Video Lessons with YouTube Integration
   📝 2 Interactive Quizzes
   🏆 Final Exam with Certificate

🌐 Starting development server...
`)

// Start the Next.js development server
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
})

devServer.on('error', (error) => {
  console.error('Failed to start development server:', error)
})

devServer.on('close', (code) => {
  console.log(`Development server exited with code ${code}`)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...')
  devServer.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  devServer.kill('SIGTERM')
  process.exit(0)
})