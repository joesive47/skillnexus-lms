import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { createHash } from 'crypto'

export interface BadgeDesign {
  background: {
    shape: 'circle' | 'shield' | 'hexagon' | 'square'
    color: string
    gradient?: { from: string; to: string }
  }
  icon: {
    type: 'emoji' | 'text' | 'shape'
    value: string
    color: string
    size: number
  }
  text: {
    primary: string
    secondary?: string
    font: string
    color: string
  }
  border: {
    width: number
    color: string
    style: 'solid' | 'dashed' | 'dotted'
  }
}

export class BadgeAssetService {
  
  /**
   * Upload badge asset (PNG/SVG/WebP)
   */
  async uploadBadgeAsset(
    file: File,
    createdBy?: string
  ): Promise<{ id: string; url: string }> {
    try {
      // Validate file type
      const allowedTypes = ['image/png', 'image/svg+xml', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PNG, SVG, and WebP are allowed.')
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum 5MB allowed.')
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `badge_${timestamp}.${extension}`
      
      // Create upload directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'badges')
      await mkdir(uploadDir, { recursive: true })
      
      // Save file
      const filePath = join(uploadDir, filename)
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)
      
      // Calculate checksum
      const checksum = createHash('md5').update(buffer).digest('hex')
      
      // Get image dimensions (for PNG/WebP)
      let width: number | undefined
      let height: number | undefined
      
      if (file.type === 'image/png' || file.type === 'image/webp') {
        // Simple dimension extraction (you might want to use a proper image library)
        const dimensions = await this.getImageDimensions(buffer)
        width = dimensions.width
        height = dimensions.height
      }
      
      // Save to database
      const asset = await prisma.mediaAsset.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          width,
          height,
          url: `/uploads/badges/${filename}`,
          checksum,
          createdBy
        }
      })
      
      return { id: asset.id, url: asset.url }
      
    } catch (error) {
      console.error('Error uploading badge asset:', error)
      throw error
    }
  }
  
  /**
   * Create badge using in-system builder
   */
  async createBadgeFromDesign(
    design: BadgeDesign,
    name: string,
    createdBy?: string
  ): Promise<{ id: string; url: string }> {
    try {
      // Generate SVG from design
      const svg = this.generateBadgeSVG(design)
      
      // Convert SVG to PNG (you might want to use a proper library like sharp)
      const pngBuffer = await this.svgToPng(svg)
      
      // Generate filename
      const timestamp = Date.now()
      const filename = `badge_design_${timestamp}.png`
      
      // Save file
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'badges')
      await mkdir(uploadDir, { recursive: true })
      const filePath = join(uploadDir, filename)
      await writeFile(filePath, pngBuffer)
      
      // Calculate checksum
      const checksum = createHash('md5').update(pngBuffer).digest('hex')
      
      // Save to database
      const asset = await prisma.mediaAsset.create({
        data: {
          filename,
          originalName: `${name}.png`,
          mimeType: 'image/png',
          fileSize: pngBuffer.length,
          width: 200,
          height: 200,
          url: `/uploads/badges/${filename}`,
          checksum,
          createdBy
        }
      })
      
      return { id: asset.id, url: asset.url }
      
    } catch (error) {
      console.error('Error creating badge from design:', error)
      throw error
    }
  }
  
  /**
   * Generate SVG from badge design
   */
  private generateBadgeSVG(design: BadgeDesign): string {
    const { background, icon, text, border } = design
    
    let backgroundElement = ''
    
    // Generate background shape
    switch (background.shape) {
      case 'circle':
        backgroundElement = `<circle cx="100" cy="100" r="90" fill="${background.color}" stroke="${border.color}" stroke-width="${border.width}"/>`
        break
      case 'shield':
        backgroundElement = `<path d="M100 10 L170 40 L170 120 L100 190 L30 120 L30 40 Z" fill="${background.color}" stroke="${border.color}" stroke-width="${border.width}"/>`
        break
      case 'hexagon':
        backgroundElement = `<polygon points="100,20 160,50 160,130 100,160 40,130 40,50" fill="${background.color}" stroke="${border.color}" stroke-width="${border.width}"/>`
        break
      case 'square':
        backgroundElement = `<rect x="20" y="20" width="160" height="160" rx="10" fill="${background.color}" stroke="${border.color}" stroke-width="${border.width}"/>`
        break
    }
    
    // Generate icon
    let iconElement = ''
    if (icon.type === 'emoji' || icon.type === 'text') {
      iconElement = `<text x="100" y="110" text-anchor="middle" font-size="${icon.size}" fill="${icon.color}">${icon.value}</text>`
    }
    
    // Generate text
    let textElement = ''
    if (text.primary) {
      textElement = `<text x="100" y="150" text-anchor="middle" font-size="12" font-family="${text.font}" fill="${text.color}">${text.primary}</text>`
      if (text.secondary) {
        textElement += `<text x="100" y="165" text-anchor="middle" font-size="10" font-family="${text.font}" fill="${text.color}">${text.secondary}</text>`
      }
    }
    
    return `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        ${backgroundElement}
        ${iconElement}
        ${textElement}
      </svg>
    `
  }
  
  /**
   * Convert SVG to PNG (simplified - you should use a proper library)
   */
  private async svgToPng(svg: string): Promise<Buffer> {
    // This is a placeholder - in production, use sharp or similar library
    // For now, we'll just return the SVG as a buffer
    return Buffer.from(svg, 'utf-8')
  }
  
  /**
   * Get image dimensions (simplified)
   */
  private async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    // This is a placeholder - in production, use sharp or similar library
    return { width: 200, height: 200 }
  }
  
  /**
   * Create badge design template
   */
  async createBadgeTemplate(
    name: string,
    description: string,
    templateData: BadgeDesign
  ) {
    const template = await prisma.badgeDesignTemplate.create({
      data: {
        name,
        description,
        templateData: JSON.stringify(templateData),
        previewUrl: await this.generatePreviewUrl(templateData)
      }
    })
    
    return template
  }
  
  /**
   * Get all badge templates
   */
  async getBadgeTemplates() {
    return await prisma.badgeDesignTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  }
  
  /**
   * Generate preview URL for template
   */
  private async generatePreviewUrl(design: BadgeDesign): Promise<string> {
    // Generate a small preview image
    const svg = this.generateBadgeSVG(design)
    // In production, convert to small PNG and save
    return '/api/badge-preview/' // Placeholder
  }
  
  /**
   * Delete badge asset
   */
  async deleteBadgeAsset(assetId: string) {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId }
    })
    
    if (!asset) {
      throw new Error('Asset not found')
    }
    
    // Check if asset is being used
    const [courseBadgeUsage, careerBadgeUsage] = await Promise.all([
      prisma.courseBadgeDefinition.count({ where: { assetId } }),
      prisma.careerBadgeDefinition.count({ where: { assetId } })
    ])
    
    if (courseBadgeUsage > 0 || careerBadgeUsage > 0) {
      throw new Error('Cannot delete asset: it is being used by badge definitions')
    }
    
    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', asset.url)
      await import('fs/promises').then(fs => fs.unlink(filePath))
    } catch (error) {
      console.warn('Could not delete file from filesystem:', error)
    }
    
    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id: assetId }
    })
  }
  
  /**
   * Get asset by ID
   */
  async getAsset(assetId: string) {
    return await prisma.mediaAsset.findUnique({
      where: { id: assetId }
    })
  }
  
  /**
   * List all assets with pagination
   */
  async listAssets(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mediaAsset.count()
    ])
    
    return {
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}

export const badgeAssetService = new BadgeAssetService()