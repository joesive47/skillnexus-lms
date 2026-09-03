// Real-time Performance Metrics Collector
export class MetricsCollector {
  private static metrics = {
    requests: {
      total: 0,
      success: 0,
      errors: 0,
      avgResponseTime: 0
    },
    database: {
      queries: 0,
      avgQueryTime: 0,
      slowQueries: 0
    },
    cache: {
      hits: 0,
      misses: 0,
      hitRate: 0
    },
    system: {
      cpu: 0,
      memory: 0,
      uptime: 0
    }
  };

  private static responseTimes: number[] = [];
  private static queryTimes: number[] = [];

  // Record HTTP request
  static recordRequest(duration: number, success: boolean) {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.errors++;
    }

    this.responseTimes.push(duration);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    this.metrics.requests.avgResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  // Record database query
  static recordQuery(duration: number) {
    this.metrics.database.queries++;
    
    if (duration > 1000) {
      this.metrics.database.slowQueries++;
    }

    this.queryTimes.push(duration);
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift();
    }

    this.metrics.database.avgQueryTime = 
      this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length;
  }

  // Record cache hit/miss
  static recordCacheHit(hit: boolean) {
    if (hit) {
      this.metrics.cache.hits++;
    } else {
      this.metrics.cache.misses++;
    }

    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0 
      ? (this.metrics.cache.hits / total) * 100 
      : 0;
  }

  // Update system metrics
  static updateSystemMetrics() {
    const usage = process.memoryUsage();
    this.metrics.system.memory = Math.round(usage.heapUsed / 1024 / 1024);
    this.metrics.system.uptime = Math.round(process.uptime());
    this.metrics.system.cpu = process.cpuUsage().user / 1000000; // Convert to seconds
  }

  // Get all metrics
  static getMetrics() {
    this.updateSystemMetrics();
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  // Reset metrics
  static reset() {
    this.metrics = {
      requests: { total: 0, success: 0, errors: 0, avgResponseTime: 0 },
      database: { queries: 0, avgQueryTime: 0, slowQueries: 0 },
      cache: { hits: 0, misses: 0, hitRate: 0 },
      system: { cpu: 0, memory: 0, uptime: 0 }
    };
    this.responseTimes = [];
    this.queryTimes = [];
  }

  // Get performance summary
  static getSummary() {
    const metrics = this.getMetrics();
    
    return {
      health: this.calculateHealth(metrics),
      performance: {
        responseTime: Math.round(metrics.requests.avgResponseTime),
        queryTime: Math.round(metrics.database.avgQueryTime),
        cacheHitRate: Math.round(metrics.cache.hitRate),
        errorRate: metrics.requests.total > 0 
          ? Math.round((metrics.requests.errors / metrics.requests.total) * 100)
          : 0
      },
      resources: {
        memory: `${metrics.system.memory}MB`,
        uptime: `${Math.floor(metrics.system.uptime / 3600)}h ${Math.floor((metrics.system.uptime % 3600) / 60)}m`
      }
    };
  }

  // Calculate overall health score (0-100)
  private static calculateHealth(metrics: any): number {
    let score = 100;

    // Response time penalty
    if (metrics.requests.avgResponseTime > 1000) score -= 30;
    else if (metrics.requests.avgResponseTime > 500) score -= 15;

    // Error rate penalty
    const errorRate = metrics.requests.total > 0 
      ? (metrics.requests.errors / metrics.requests.total) * 100 
      : 0;
    if (errorRate > 5) score -= 30;
    else if (errorRate > 1) score -= 15;

    // Cache hit rate bonus
    if (metrics.cache.hitRate > 80) score += 10;
    else if (metrics.cache.hitRate < 50) score -= 10;

    return Math.max(0, Math.min(100, score));
  }
}

// Auto-update system metrics every 10 seconds
setInterval(() => MetricsCollector.updateSystemMetrics(), 10000);
