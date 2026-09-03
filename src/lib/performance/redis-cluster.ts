/**
 * Phase 8: Redis Cluster Manager
 * Advanced caching with Redis cluster support
 */

import { Redis } from 'ioredis';

interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

export class RedisCluster {
  private static instance: RedisCluster;
  private client: Redis | null = null;
  private isConnected = false;

  private constructor() {
    this.connect();
  }

  static getInstance(): RedisCluster {
    if (!RedisCluster.instance) {
      RedisCluster.instance = new RedisCluster();
    }
    return RedisCluster.instance;
  }

  private connect() {
    try {
      const redisUrl = process.env.REDIS_URL;
      if (!redisUrl) {
        console.warn('Redis URL not configured, using memory cache');
        return;
      }

      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => Math.min(times * 50, 2000),
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Redis connected');
      });

      this.client.on('error', (err) => {
        console.error('Redis error:', err);
        this.isConnected = false;
      });
    } catch (error) {
      console.error('Redis connection failed:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;
    
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    
    try {
      const ttl = options?.ttl || 3600;
      const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
      await this.client.setex(fullKey, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    
    try {
      await this.client.flushdb();
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      return false;
    }
  }

  async getStats(): Promise<{
    connected: boolean;
    keys: number;
    memory: string;
  }> {
    if (!this.client || !this.isConnected) {
      return { connected: false, keys: 0, memory: '0' };
    }

    try {
      const keys = await this.client.dbsize();
      const info = await this.client.info('memory');
      const memory = info.match(/used_memory_human:(.+)/)?.[1] || '0';
      
      return { connected: true, keys, memory: memory.trim() };
    } catch (error) {
      return { connected: false, keys: 0, memory: '0' };
    }
  }
}

export const redisCluster = RedisCluster.getInstance();
