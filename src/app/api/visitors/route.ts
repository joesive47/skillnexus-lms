import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'visitor-count.txt')

export const dynamic = 'force-dynamic'

function getCount(): number {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      return parseInt(fs.readFileSync(COUNTER_FILE, 'utf-8')) || 0
    }
  } catch (e) {
    console.error('Read error:', e)
  }
  return 0
}

function incrementCount(): number {
  try {
    const current = getCount()
    const newCount = current + 1
    fs.writeFileSync(COUNTER_FILE, newCount.toString())
    return newCount
  } catch (e) {
    console.error('Write error:', e)
    return 0
  }
}

export async function GET() {
  const count = getCount()
  return NextResponse.json({ count }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  })
}

export async function POST() {
  const count = incrementCount()
  return NextResponse.json({ count }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  })
}
