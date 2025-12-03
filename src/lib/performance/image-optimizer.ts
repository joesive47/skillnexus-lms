// Image Optimization for CDN
export const imageOptimizer = {
  formats: ['webp', 'avif', 'jpeg'] as const,
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  quality: 85,

  getOptimizedUrl(src: string, width?: number, format: 'webp' | 'avif' | 'jpeg' = 'webp') {
    if (!src) return '';
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', this.quality.toString());
    params.set('f', format);
    return `${src}?${params.toString()}`;
  },

  getSrcSet(src: string) {
    return this.sizes.map(size => `${this.getOptimizedUrl(src, size)} ${size}w`).join(', ');
  }
};
