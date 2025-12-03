// Database Query Optimizer
import { PrismaClient } from '@prisma/client';

export class DatabaseOptimizer {
  private static queryCache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_TTL = 60000; // 1 minute

  // Query with caching
  static async cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = this.CACHE_TTL
  ): Promise<T> {
    const cached = this.queryCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    const data = await queryFn();
    this.queryCache.set(key, { data, timestamp: Date.now() });
    
    return data;
  }

  // Batch queries
  static async batchQuery<T>(
    queries: Array<() => Promise<T>>
  ): Promise<T[]> {
    return Promise.all(queries.map(q => q()));
  }

  // Clear cache
  static clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.queryCache.keys()) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }

  // Connection pool stats
  static getPoolStats() {
    return {
      cacheSize: this.queryCache.size,
      cacheKeys: Array.from(this.queryCache.keys())
    };
  }
}

// Optimized Prisma queries
export const optimizedQueries = {
  // Get user with minimal data
  getUserBasic: async (prisma: PrismaClient, userId: string) => {
    return DatabaseOptimizer.cachedQuery(
      `user:${userId}`,
      () => prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })
    );
  },

  // Get courses with pagination
  getCoursesPaginated: async (
    prisma: PrismaClient,
    page: number = 1,
    limit: number = 20
  ) => {
    const skip = (page - 1) * limit;
    
    return DatabaseOptimizer.cachedQuery(
      `courses:${page}:${limit}`,
      () => prisma.course.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          published: true,
          _count: {
            select: { enrollments: true }
          }
        },
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      }),
      30000 // 30 seconds cache
    );
  },

  // Get user enrollments efficiently
  getUserEnrollments: async (prisma: PrismaClient, userId: string) => {
    return DatabaseOptimizer.cachedQuery(
      `enrollments:${userId}`,
      () => prisma.enrollment.findMany({
        where: { userId },
        select: {
          id: true,
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      60000 // 1 minute cache
    );
  }
};
