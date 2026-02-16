/**
 * Extract YouTube Video ID from various URL formats
 * Supports: standard, short, shorts, embed, mobile URLs
 */
export function extractYouTubeID(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  
  // Remove whitespace and convert to lowercase for matching
  url = url.trim()
  
  // If it's already just an ID (11 characters, alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }
  
  // YouTube URL patterns (case insensitive)
  const patterns = [
    // Standard: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
    // Short: https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    // Shorts: https://www.youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    // Embed: https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i,
    // Mobile: https://m.youtube.com/watch?v=VIDEO_ID
    /(?:m\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
    // Gaming: https://gaming.youtube.com/watch?v=VIDEO_ID
    /(?:gaming\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
    // Music: https://music.youtube.com/watch?v=VIDEO_ID
    /(?:music\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Validate if a string is a valid YouTube Video ID
 */
export function isValidYouTubeID(id: string): boolean {
  if (!id || typeof id !== 'string') return false
  return /^[a-zA-Z0-9_-]{11}$/.test(id.trim())
}

/**
 * Clean and validate YouTube ID, with detailed error info
 */
export function validateYouTubeID(id: string): { isValid: boolean; cleanId: string; error?: string } {
  if (!id || typeof id !== 'string') {
    return { isValid: false, cleanId: '', error: 'ไม่พบรหัสวีดีโอ' }
  }
  
  // Try to extract ID from URL first
  let cleanId = extractYouTubeID(id) || id.trim()
  
  if (cleanId.length !== 11) {
    return { 
      isValid: false, 
      cleanId, 
      error: `รหัสวีดีโอไม่ถูกต้อง: ${cleanId.length} ตัวอักษร (ต้องการ 11 ตัวอักษร)` 
    }
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanId)) {
    return { 
      isValid: false, 
      cleanId, 
      error: 'รหัสวีดีโอมีตัวอักษรที่ไม่ถูกต้อง (อนุญาตเฉพาะ a-z, A-Z, 0-9, _, -)' 
    }
  }
  
  return { isValid: true, cleanId }
}

/**
 * Generate YouTube embed URL from Video ID
 * Includes parameters to disable related videos and annotations
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    rel: '0',              // ไม่แสดงคลิปแนะนำจาก YouTube
    modestbranding: '1',   // ลด YouTube branding
    iv_load_policy: '3',   // ปิด video annotations
    cc_load_policy: '0',   // ปิด captions
    showinfo: '0',         // ไม่แสดงข้อมูลวิดีโอ
    enablejsapi: '1',      // เปิด JavaScript API
    playsinline: '1'       // เล่นแบบ inline (สำหรับมือถือ)
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

/**
 * Generate YouTube thumbnail URL from Video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault', 
    high: 'hqdefault',
    maxres: 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * Check if YouTube video exists by testing thumbnail
 */
export async function checkYouTubeVideoExists(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(getYouTubeThumbnail(videoId, 'default'), { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get video info from YouTube oEmbed API
 */
export async function getYouTubeVideoInfo(videoId: string): Promise<{ title?: string; author?: string; error?: string }> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    if (!response.ok) {
      return { error: 'ไม่พบวีดีโอนี้' }
    }
    const data = await response.json()
    return { title: data.title, author: data.author_name }
  } catch {
    return { error: 'ไม่สามารถดึงข้อมูลวีดีโอได้' }
  }
}