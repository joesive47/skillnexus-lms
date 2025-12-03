// Database Connection Pool Manager
import { PrismaClient } from '@prisma/client';

class ConnectionPool {
  private static instance: PrismaClient;
  private static connectionCount = 0;
  private static maxConnections = 100;

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      });

      // Connection lifecycle hooks
      this.instance.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();
        
        // Log slow queries
        if (after - before > 1000) {
          console.warn(`Slow query detected: ${params.model}.${params.action} took ${after - before}ms`);
        }
        
        return result;
      });
    }

    return this.instance;
  }

  static async disconnect() {
    if (this.instance) {
      await this.instance.$disconnect();
      this.connectionCount = 0;
    }
  }

  static getStats() {
    return {
      connections: this.connectionCount,
      maxConnections: this.maxConnections,
      available: this.maxConnections - this.connectionCount
    };
  }
}

export const prisma = ConnectionPool.getInstance();
export default ConnectionPool;
