/**
 * Phase 8: Asset Optimizer
 * Optimize images, videos, and static assets for CDN delivery
 */

let sharp: any;
try {
  sharp = require('sharp');
} catch (error) {
  console.warn('Sharp not available, image optimization disabled');
  sharp = null;
}
import { promises as fs } from 'fs';
import path from 'path';

export interface OptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
  format: string;
  dimensions: { width: number; height: number };
}

export class AssetOptimizer {
  private static instance: AssetOptimizer;
  private cache = new Map<string, OptimizationResult>();

  private constructor() {}

  static getInstance(): AssetOptimizer {
    if (!AssetOptimizer.instance) {
      AssetOptimizer.instance = new AssetOptimizer();
    }
    return AssetOptimizer.instance;
  }

  /**
   * Optimize image with multiple format support
   */
  async optimizeImage(
    inputPath: string,
    outputPath: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizationResult> {
    if (!sharp) {
      throw new Error('Sharp is not available. Image optimization is disabled.');
    }

    const cacheKey = `${inputPath}-${JSON.stringify(options)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      let pipeline = sharp(inputPath);

      // Resize if dimensions provided
      if (options.width || options.height) {
        pipeline = pipeline.resize(options.width, options.height, {
          fit: options.fit || 'cover',
          withoutEnlargement: true,
        });
      }

      // Convert format
      const format = options.format || 'webp';
      const quality = options.quality || 80;

      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality, progressive: true });
          break;
        case 'png':
          pipeline = pipeline.png({ quality, progressive: true });
          break;
      }

      // Save optimized image
      await pipeline.toFile(outputPath);

      const optimizedStats = await fs.stat(outputPath);
      const optimizedSize = optimizedStats.size;
      const savings = originalSize - optimizedSize;
      const savingsPercent = (savings / originalSize) * 100;

      const metadata = await sharp(outputPath).metadata();

      const result: OptimizationResult = {
        originalSize,
        optimizedSize,
        savings,
        savingsPercent,
        format,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0,
        },
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  /**
   * Generate responsive image variants
   */
  async generateResponsiveImages(
    inputPath: string,
    outputDir: string,
    sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): Promise<Map<number, OptimizationResult>> {
    const results = new Map<number, OptimizationResult>();
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${basename}-${size}w.webp`);
      
      try {
        const result = await this.optimizeImage(inputPath, outputPath, {
          width: size,
          format: 'webp',
          quality: 80,
        });
        results.set(size, result);
      } catch (error) {
        console.error(`Failed to generate ${size}w variant:`, error);
      }
    }

    return results;
  }

  /**
   * Batch optimize directory
   */
  async optimizeDirectory(
    inputDir: string,
    outputDir: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const stats = await fs.stat(inputPath);

      if (stats.isFile() && this.isImageFile(file)) {
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const outputPath = path.join(
          outputDir,
          `${basename}.${options.format || 'webp'}`
        );

        try {
          const result = await this.optimizeImage(inputPath, outputPath, options);
          results.push(result);
        } catch (error) {
          console.error(`Failed to optimize ${file}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Get optimization statistics
   */
  getStats(): {
    totalOptimized: number;
    totalSavings: number;
    averageSavingsPercent: number;
  } {
    const results = Array.from(this.cache.values());
    const totalOptimized = results.length;
    const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);
    const averageSavingsPercent =
      results.reduce((sum, r) => sum + r.savingsPercent, 0) / totalOptimized || 0;

    return {
      totalOptimized,
      totalSavings,
      averageSavingsPercent,
    };
  }

  /**
   * Clear optimization cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }
}

export const assetOptimizer = AssetOptimizer.getInstance();
