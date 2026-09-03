// Performance Alert System
export class AlertSystem {
  private static thresholds = {
    responseTime: 1000,
    errorRate: 5,
    cpuUsage: 80,
    memoryUsage: 85
  };

  static async sendAlert(type: string, message: string, severity: 'low' | 'medium' | 'high') {
    const webhook = process.env.ALERT_WEBHOOK_URL;
    if (!webhook) return;

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          severity,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Alert failed:', error);
    }
  }

  static checkThresholds(metrics: any) {
    if (metrics.requests.avgResponseTime > this.thresholds.responseTime) {
      this.sendAlert('performance', `High response time: ${metrics.requests.avgResponseTime}ms`, 'high');
    }

    const errorRate = (metrics.requests.errors / metrics.requests.total) * 100;
    if (errorRate > this.thresholds.errorRate) {
      this.sendAlert('errors', `High error rate: ${errorRate.toFixed(2)}%`, 'high');
    }

    if (metrics.system.memory > this.thresholds.memoryUsage) {
      this.sendAlert('resources', `High memory usage: ${metrics.system.memory}MB`, 'medium');
    }
  }
}
