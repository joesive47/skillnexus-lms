/**
 * Phase 8: Real-time Monitoring Service
 * Performance metrics, alerts, and health checks
 */

interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

interface Alert {
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  metric?: string;
  value?: number;
  threshold?: number;
  timestamp: Date;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private readonly MAX_METRICS = 10000;
  private readonly MAX_ALERTS = 1000;

  private thresholds = {
    responseTime: 100,
    errorRate: 5,
    cpuUsage: 80,
    memoryUsage: 85,
    diskUsage: 90,
  };

  private constructor() {
    this.startCleanup();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      tags,
    };

    this.metrics.push(metric);
    
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    this.checkThresholds(metric);
  }

  private checkThresholds(metric: Metric) {
    const threshold = this.thresholds[metric.name as keyof typeof this.thresholds];
    
    if (threshold && metric.value > threshold) {
      this.createAlert({
        level: metric.value > threshold * 1.2 ? 'CRITICAL' : 'WARNING',
        message: `${metric.name} exceeded threshold`,
        metric: metric.name,
        value: metric.value,
        threshold,
        timestamp: new Date(),
      });
    }
  }

  createAlert(alert: Alert) {
    this.alerts.push(alert);
    
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(-this.MAX_ALERTS);
    }

    console.log(`[${alert.level}] ${alert.message}`, alert);
  }

  getMetrics(name?: string, minutes: number = 60): Metric[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    let filtered = this.metrics.filter(m => m.timestamp >= cutoff);
    
    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }
    
    return filtered;
  }

  getAlerts(level?: Alert['level'], minutes: number = 60): Alert[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    let filtered = this.alerts.filter(a => a.timestamp >= cutoff);
    
    if (level) {
      filtered = filtered.filter(a => a.level === level);
    }
    
    return filtered;
  }

  getStats() {
    const now = Date.now();
    const last5min = this.metrics.filter(m => now - m.timestamp.getTime() < 300000);
    
    const avgResponseTime = this.calculateAverage(
      last5min.filter(m => m.name === 'responseTime')
    );
    
    const errorRate = this.calculateRate(
      last5min.filter(m => m.name === 'error')
    );

    return {
      totalMetrics: this.metrics.length,
      totalAlerts: this.alerts.length,
      criticalAlerts: this.alerts.filter(a => a.level === 'CRITICAL').length,
      avgResponseTime,
      errorRate,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  private calculateAverage(metrics: Metric[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  private calculateRate(metrics: Metric[]): number {
    return metrics.length / 5;
  }

  private startCleanup() {
    setInterval(() => {
      const cutoff = new Date(Date.now() - 3600000);
      this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
      this.alerts = this.alerts.filter(a => a.timestamp >= cutoff);
    }, 300000);
  }

  clearAll() {
    this.metrics = [];
    this.alerts = [];
  }
}

export const monitoringService = MonitoringService.getInstance();
