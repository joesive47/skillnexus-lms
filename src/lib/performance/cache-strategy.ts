// Multi-Layer Caching Strategy
import { redis } from '../redis';

export class CacheStrategy {
  // Layer 1: Memory Cache (fastest)
  private static memoryCache = new Map<string, { data: any; expires: number }>();
  
  // Layer 2: Redis Cache (fast, shared)
  // Layer 3: Database (slowest)

  // Get with multi-layer fallback
  static async get<T>(key: string): Promise<T | null> {
    // Layer 1: Memory
    const memory = this.memoryCache.get(key);
    if (memory && memory.expires > Date.now()) {
      return memory.data as T;
    }

    // Layer 2: Redis
    if (redis) {
      try {
        const redisData = await redis.get(key);
        if (redisData) {
          const parsed = JSON.parse(redisData);
          // Populate memory cache
          this.memoryCache.set(key, {
            data: parsed,
            expires: Date.now() + 60000 // 1 minute
          });
          return parsed as T;
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }

    return null;
  }

  // Set to all layers
  static async set(key: string, value: any, ttl: number = 3600) {
    // Layer 1: Memory (1 minute)
    this.memoryCache.set(key, {
      data: value,
      expires: Date.now() + 60000
    });

    // Layer 2: Redis (configurable TTL)
    if (redis) {
      try {
        await redis.setex(key, ttl, JSON.stringify(value));
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }
  }

  // Invalidate all layers
  static async invalidate(pattern: string) {
    // Clear memory
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear Redis
    if (redis) {
      try {
        const keys = await redis.keys(`*${pattern}*`);
        if (keys.length > 0) {
          await Promise.all(keys.map((key: string) => redis!.del(key)));
        }
      } catch (error) {
        console.error('Redis invalidate error:', error);
      }
    }
  }

  // Cache statistics
  static getStats() {
    return {
      memorySize: this.memoryCache.size,
      memoryKeys: Array.from(this.memoryCache.keys())
    };
  }

  // Cleanup expired memory cache
  static cleanup() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expires < now) {
        this.memoryCache.delete(key);
      }
    }
  }
}

// Auto cleanup every 5 minutes
setInterval(() => CacheStrategy.cleanup(), 300000);

// Predefined cache keys
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  course: (id: string) => `course:${id}`,
  courses: (page: number) => `courses:page:${page}`,
  enrollment: (userId: string, courseId: string) => `enrollment:${userId}:${courseId}`,
  progress: (userId: string, lessonId: string) => `progress:${userId}:${lessonId}`,
  leaderboard: () => 'leaderboard:global',
  analytics: (userId: string) => `analytics:${userId}`
};
