'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive, 
  MemoryStick,
  Server,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Users,
  Eye
} from 'lucide-react'

interface SystemMetrics {
  status: 'healthy' | 'warning' | 'critical'
  score: number
  responseTime: number
  throughput: number
  errorRate: number
  memoryUsage: number
  cpuUsage: number
  activeUsers: number
  cacheHitRate: number
  dbConnections: number
}

interface RealTimeEvent {
  id: string
  type: 'user_login' | 'course_access' | 'error' | 'performance' | 'security'
  message: string
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
  metadata?: any
}

export default function RealTimeMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: 'healthy',
    score: 95,
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.02,
    memoryUsage: 68,
    cpuUsage: 45,
    activeUsers: 342,
    cacheHitRate: 94,
    dbConnections: 12
  })
  
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update metrics with realistic variations
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.max(100, prev.responseTime + (Math.random() - 0.5) * 50),
        throughput: Math.max(800, prev.throughput + (Math.random() - 0.5) * 200),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        activeUsers: Math.max(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20)),
        cacheHitRate: Math.max(85, Math.min(98, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
        dbConnections: Math.max(5, Math.min(20, prev.dbConnections + Math.floor((Math.random() - 0.5) * 3)))
      }))

      // Add random events
      if (Math.random() < 0.3) {
        const eventTypes = ['user_login', 'course_access', 'performance'] as const
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        
        const newEvent: RealTimeEvent = {
          id: `event_${Date.now()}_${Math.random()}`,
          type: randomType,
          message: getEventMessage(randomType),
          timestamp: new Date(),
          severity: Math.random() < 0.1 ? 'warning' : 'info'
        }

        setEvents(prev => [newEvent, ...prev.slice(0, 49)]) // Keep last 50 events
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getEventMessage = (type: RealTimeEvent['type']): string => {
    const messages = {
      user_login: 'ผู้ใช้เข้าสู่ระบบใหม่',
      course_access: 'เข้าถึงคอร์สเรียน',
      error: 'เกิดข้อผิดพลาดในระบบ',
      performance: 'ตรวจสอบประสิทธิภาพระบบ',
      security: 'ตรวจพบกิจกรรมที่น่าสงสัย'
    }
    return messages[type]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'critical': return <XCircle className="w-5 h-5 text-red-400" />
      default: return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const MetricCard = ({ title, value, unit, icon: Icon, trend, status }: any) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">{title}</span>
          </div>
          {trend && (
            <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
        {status && (
          <div className="mt-2">
            <Progress value={status} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-purple-400" />
            Real-Time System Monitoring
          </h1>
          <p className="text-gray-400 mt-1">การติดตามระบบแบบเรียลไทม์</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'เชื่อมต่อแล้ว' : 'ขาดการเชื่อมต่อ'}
            </span>
          </div>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            ดูรายละเอียด
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              สถานะระบบโดยรวม
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(metrics.status)}
              <span className={`font-semibold ${getStatusColor(metrics.status)}`}>
                {metrics.status.toUpperCase()}
              </span>
              <Badge variant="outline" className="ml-2">
                Score: {metrics.score}/100
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              title="Response Time"
              value={Math.round(metrics.responseTime)}
              unit="ms"
              icon={Clock}
              trend={-2.3}
            />
            <MetricCard
              title="Throughput"
              value={metrics.throughput.toLocaleString()}
              unit="req/min"
              icon={Zap}
              trend={5.1}
            />
            <MetricCard
              title="Error Rate"
              value={(metrics.errorRate * 100).toFixed(2)}
              unit="%"
              icon={AlertTriangle}
              trend={-0.5}
            />
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers}
              unit="users"
              icon={Users}
              trend={12.8}
            />
            <MetricCard
              title="Cache Hit Rate"
              value={Math.round(metrics.cacheHitRate)}
              unit="%"
              icon={Database}
              trend={1.2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Usage */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              การใช้ทรัพยากร
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 flex items-center">
                  <Cpu className="w-4 h-4 mr-1" />
                  CPU Usage
                </span>
                <span className="text-white">{Math.round(metrics.cpuUsage)}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 flex items-center">
                  <MemoryStick className="w-4 h-4 mr-1" />
                  Memory Usage
                </span>
                <span className="text-white">{Math.round(metrics.memoryUsage)}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 flex items-center">
                  <Database className="w-4 h-4 mr-1" />
                  DB Connections
                </span>
                <span className="text-white">{metrics.dbConnections}/20</span>
              </div>
              <Progress value={(metrics.dbConnections / 20) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 flex items-center">
                  <Wifi className="w-4 h-4 mr-1" />
                  Network I/O
                </span>
                <span className="text-white">2.3 MB/s</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Real-time Events */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  เหตุการณ์แบบเรียลไทม์
                </div>
                <Badge variant="outline">
                  {events.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>รอเหตุการณ์ใหม่...</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          event.severity === 'error' ? 'bg-red-400' :
                          event.severity === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <div>
                          <p className="text-white text-sm">{event.message}</p>
                          <p className="text-gray-400 text-xs">
                            {event.timestamp.toLocaleTimeString('th-TH')}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          event.severity === 'error' ? 'border-red-400 text-red-400' :
                          event.severity === 'warning' ? 'border-yellow-400 text-yellow-400' :
                          'border-green-400 text-green-400'
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Trends */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            แนวโน้มประสิทธิภาพ (24 ชั่วโมงที่ผ่านมา)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">99.8%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1.2M</div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">245ms</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">0.02%</div>
              <div className="text-sm text-gray-400">Error Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}