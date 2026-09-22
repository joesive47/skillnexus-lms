// Database Connection Pool Manager
//
// Prisma owns the underlying pool. Re-export the shared application client so
// performance helpers do not create a second independent pool.
import sharedPrisma from '../prisma';
import type { PrismaClient } from '@prisma/client';

class ConnectionPool {
  private static instance: PrismaClient;
  private static connectionCount = 0;
  private static maxConnections = 100;

  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = sharedPrisma;
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

export const prisma = sharedPrisma;
export default ConnectionPool;
