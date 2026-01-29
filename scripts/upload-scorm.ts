import { put, list } from '@vercel/blob'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

async function uploadSCORMFiles() {
  console.log('📦 Uploading SCORM files to Vercel Blob...\n')

  const scormDir = './public/scorm'
  const courses = [
    'sdgs-leadership-2030',
    'circular-economy-zero-waste',
    'social-entrepreneurship-impact',
    'renewable-energy-cleantech',
    'regenerative-agriculture-food'
  ]

  const urls: Record<string, string> = {}

  for (const course of courses) {
    const coursePath = join(scormDir, course)
    console.log(`📤 Uploading: ${course}`)

    // Upload all files in course directory
    const files = getAllFiles(coursePath)
    
    for (const file of files) {
      const relativePath = file.replace(scormDir + '/', '')
      const content = readFileSync(file)
      
      const blob = await put(relativePath, content, {
        access: 'public',
        contentType: getContentType(file)
      })
      
      if (file.endsWith('index.html')) {
        urls[course] = blob.url
        console.log(`✅ ${course}: ${blob.url}`)
      }
    }
  }

  console.log('\n🎉 Upload complete!')
  console.log('\n📋 Course URLs:')
  console.log(JSON.stringify(urls, null, 2))
  
  return urls
}

function getAllFiles(dir: string): string[] {
  const files: string[] = []
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }
  
  return files
}

function getContentType(file: string): string {
  if (file.endsWith('.html')) return 'text/html'
  if (file.endsWith('.js')) return 'application/javascript'
  if (file.endsWith('.css')) return 'text/css'
  if (file.endsWith('.json')) return 'application/json'
  if (file.endsWith('.xml')) return 'application/xml'
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg'
  if (file.endsWith('.png')) return 'image/png'
  if (file.endsWith('.gif')) return 'image/gif'
  if (file.endsWith('.mp4')) return 'video/mp4'
  return 'application/octet-stream'
}

uploadSCORMFiles().catch(console.error)
