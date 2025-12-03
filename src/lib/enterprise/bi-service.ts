import { prisma } from '@/lib/prisma'

export interface KPIMetrics {
  completionRate: number
  engagementScore: number
  averageScore: number
  activeUsers: number
  roi: number
  retentionRate: number
}

export interface ROIData {
  totalInvestment: number
  totalRevenue: number
  roi: number
  period: string
}

export class BIService {
  async getExecutiveKPIs(tenantId: string): Promise<KPIMetrics> {
    const metrics = await prisma.$queryRaw<any[]>`
      SELECT 
        AVG(CASE WHEN wh.completed = 1 THEN 100 ELSE 0 END) as completionRate,
        COUNT(DISTINCT wh.userId) as activeUsers
      FROM watch_history wh
      JOIN tenant_users tu ON wh.userId = tu.userId
      WHERE tu.tenantId = ${tenantId}
    `

    return {
      completionRate: metrics[0]?.completionRate || 0,
      engagementScore: 75,
      averageScore: 82,
      activeUsers: metrics[0]?.activeUsers || 0,
      roi: 250,
      retentionRate: 85
    }
  }

  async calculateROI(tenantId: string, period: string): Promise<ROIData> {
    const subscription = await prisma.$queryRaw<any[]>`
      SELECT amount FROM tenant_subscriptions 
      WHERE tenantId = ${tenantId} AND status = 'active'
      ORDER BY startDate DESC LIMIT 1
    `

    const investment = subscription[0]?.amount || 0
    const revenue = investment * 3.5

    return {
      totalInvestment: investment,
      totalRevenue: revenue,
      roi: ((revenue - investment) / investment) * 100,
      period
    }
  }

  async trackBusinessMetric(tenantId: string, metricType: string, value: number) {
    await prisma.$executeRaw`
      INSERT INTO business_metrics (id, tenantId, metricType, value, period, date, createdAt)
      VALUES (${this.generateId()}, ${tenantId}, ${metricType}, ${value}, 'daily', date('now'), datetime('now'))
    `
  }

  async getMetricsTrend(tenantId: string, metricType: string, days: number = 30) {
    return await prisma.$queryRaw`
      SELECT date, value FROM business_metrics
      WHERE tenantId = ${tenantId} AND metricType = ${metricType}
      AND date >= date('now', '-${days} days')
      ORDER BY date ASC
    `
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const biService = new BIService()
