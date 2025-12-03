// Load Balancer Configuration
export const loadBalancerConfig = {
  aws: {
    type: 'application', // ALB or NLB
    healthCheck: {
      path: '/api/health',
      interval: 30,
      timeout: 5,
      healthyThreshold: 2,
      unhealthyThreshold: 3
    },
    
    // Auto-scaling configuration
    autoScaling: {
      minInstances: 2,
      maxInstances: 50,
      targetCPU: 70, // Scale when CPU > 70%
      targetMemory: 80, // Scale when Memory > 80%
      scaleUpCooldown: 300, // 5 minutes
      scaleDownCooldown: 600 // 10 minutes
    },

    // Sticky sessions
    stickySession: {
      enabled: true,
      duration: 3600 // 1 hour
    }
  },

  // Traffic distribution
  routing: {
    algorithm: 'round-robin', // round-robin, least-connections, ip-hash
    weights: {
      primary: 80,
      secondary: 20
    }
  }
};

// Health check endpoint
export async function healthCheck() {
  const checks = {
    database: false,
    redis: false,
    storage: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Check database
    const { prisma } = await import('./connection-pool');
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check Redis
    const redis = (await import('../redis')).default;
    if (redis) {
      await redis.ping();
      checks.redis = true;
    }
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  checks.storage = true; // Assume storage is healthy

  const isHealthy = checks.database && checks.redis && checks.storage;

  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    uptime: process.uptime()
  };
}

// Request distribution metrics
export class LoadBalancerMetrics {
  private static requests = new Map<string, number>();

  static recordRequest(instanceId: string) {
    const count = this.requests.get(instanceId) || 0;
    this.requests.set(instanceId, count + 1);
  }

  static getMetrics() {
    return {
      distribution: Object.fromEntries(this.requests),
      total: Array.from(this.requests.values()).reduce((a, b) => a + b, 0)
    };
  }

  static reset() {
    this.requests.clear();
  }
}
