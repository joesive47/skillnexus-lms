'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ANALYTICS_RANGES, type AnalyticsRange, type LearningAnalyticsPayload } from '@/lib/admin-learning-analytics'

const PIE_COLORS = ['#38bdf8', '#8b5cf6', '#f97316', '#10b981', '#ec4899', '#eab308', '#14b8a6']

function number(value: number) {
  return new Intl.NumberFormat('th-TH').format(value)
}

function updatedAt(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function MetricCard({ title, value, description, icon: Icon, accent }: {
  title: string
  value: string
  description: string
  icon: LucideIcon
  accent: string
}) {
  return (
    <Card className="border-white/10 bg-slate-950/50 text-white shadow-lg shadow-slate-950/10 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-300">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-2 text-xs text-slate-400">{description}</p>
          </div>
          <div className={`rounded-2xl p-3 ${accent}`}><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LearningIntelligenceDashboard() {
  const [range, setRange] = useState<AnalyticsRange>(30)
  const [data, setData] = useState<LearningAnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?days=${range}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('ไม่สามารถอ่านข้อมูลจากระบบได้')
      setData(await response.json())
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ไม่สามารถอ่านข้อมูลจากระบบได้')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [range])

  useEffect(() => {
    void load()
    const interval = window.setInterval(() => void load(true), 30_000)
    return () => window.clearInterval(interval)
  }, [load])

  if (loading && !data) {
    return <div className="flex min-h-[520px] items-center justify-center text-slate-300"><RefreshCw className="mr-3 h-6 w-6 animate-spin" />กำลังอ่านข้อมูลจริงจากระบบ…</div>
  }

  if (!data) {
    return <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 p-8 text-rose-100"><h1 className="text-xl font-bold">ไม่สามารถโหลดแดชบอร์ดได้</h1><p className="mt-2 text-sm">{error || 'กรุณาลองใหม่อีกครั้ง'}</p><Button className="mt-5" onClick={() => void load()}>ลองใหม่</Button></div>
  }

  const { metrics } = data
  const maxCategoryEnrollment = Math.max(...data.categoryPerformance.map((item) => item.enrollments), 1)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-950 p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute -right-10 -top-12 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-50"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />LIVE DATA</div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Learning Intelligence</h1>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100 sm:text-base">มองเห็นการเติบโต การมีส่วนร่วม และจุดที่ต้องดูแลของระบบเรียนรู้จากข้อมูลจริง</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ANALYTICS_RANGES.map((days) => <Button key={days} size="sm" variant={range === days ? 'secondary' : 'outline'} onClick={() => setRange(days)} className={range === days ? 'bg-white text-indigo-800 hover:bg-indigo-50' : 'border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white'}>{days} วัน</Button>)}
            <Button size="sm" variant="outline" onClick={() => void load(true)} disabled={refreshing} className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"><RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />รีเฟรช</Button>
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-2 text-xs text-indigo-100"><Clock3 className="h-3.5 w-3.5" />อัปเดตอัตโนมัติทุก 30 วินาที · ล่าสุด {updatedAt(data.lastUpdated)}</div>
      </section>

      {error && <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">การรีเฟรชล่าสุดไม่สำเร็จ: {error} — กำลังแสดงข้อมูลชุดก่อนหน้า</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="ผู้เรียนทั้งหมด" value={number(metrics.totalLearners)} description="บัญชีบทบาท STUDENT ทั้งหมด" icon={Users} accent="bg-sky-400/15 text-sky-300" />
        <MetricCard title="ผู้เรียนที่ active" value={number(metrics.activeLearners)} description={`มีกิจกรรมใน ${data.rangeDays} วันล่าสุด`} icon={Activity} accent="bg-emerald-400/15 text-emerald-300" />
        <MetricCard title="ลงทะเบียนใหม่" value={number(metrics.enrollments)} description={`ภายใน ${data.rangeDays} วันล่าสุด`} icon={TrendingUp} accent="bg-violet-400/15 text-violet-300" />
        <MetricCard title="อัตราการจบ" value={`${metrics.completionRate}%`} description="เรียนจบเทียบการลงทะเบียนในช่วงเวลา" icon={CheckCircle2} accent="bg-fuchsia-400/15 text-fuchsia-300" />
        <MetricCard title="ใบรับรองที่ออก" value={number(metrics.certificatesIssued)} description={`สถานะ ACTIVE ใน ${data.rangeDays} วัน`} icon={Award} accent="bg-amber-400/15 text-amber-300" />
        <MetricCard title="คอร์สที่เผยแพร่" value={number(metrics.publishedCourses)} description={`ผู้เรียนที่ควรดูแล ${number(metrics.atRiskLearners)} ราย`} icon={BookOpen} accent="bg-cyan-400/15 text-cyan-300" />
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="border-white/10 bg-slate-950/50 text-white xl:col-span-3">
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-300" />แนวโน้มกิจกรรมการเรียนรู้</CardTitle><CardDescription className="text-slate-400">กิจกรรมการเรียนรู้ต่อวัน โดยไม่มีข้อมูลจำลอง</CardDescription></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><AreaChart data={data.trend}><defs><linearGradient id="activity-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} /><Area type="monotone" dataKey="activities" name="กิจกรรม" stroke="#22d3ee" strokeWidth={3} fill="url(#activity-gradient)" /></AreaChart></ResponsiveContainer></CardContent>
        </Card>
        <Card className="border-white/10 bg-slate-950/50 text-white xl:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-violet-300" />การลงทะเบียนและเรียนจบ</CardTitle><CardDescription className="text-slate-400">เปรียบเทียบรายวันในช่วงที่เลือก</CardDescription></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={data.trend}><CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} /><Bar dataKey="enrollments" name="ลงทะเบียน" fill="#8b5cf6" radius={[5, 5, 0, 0]} /><Bar dataKey="completions" name="เรียนจบ" fill="#34d399" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="border-white/10 bg-slate-950/50 text-white xl:col-span-2"><CardHeader><CardTitle>แรงขับตามหมวดหมู่</CardTitle><CardDescription className="text-slate-400">สัดส่วนการลงทะเบียนตามหมวดหลัก</CardDescription></CardHeader><CardContent>{data.categoryPerformance.length ? <ResponsiveContainer width="100%" height={290}><PieChart><Pie data={data.categoryPerformance} dataKey="enrollments" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3}>{data.categoryPerformance.map((item, index) => <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} /></PieChart></ResponsiveContainer> : <EmptyState text="ยังไม่มีการลงทะเบียนในช่วงเวลานี้" />}</CardContent></Card>
        <Card className="border-white/10 bg-slate-950/50 text-white xl:col-span-3"><CardHeader><CardTitle>ประสิทธิภาพหมวดหมู่</CardTitle><CardDescription className="text-slate-400">ใช้เพื่อกำหนดหัวข้อคอร์สและแผนการสื่อสารถัดไป</CardDescription></CardHeader><CardContent className="space-y-4">{data.categoryPerformance.length ? data.categoryPerformance.slice(0, 6).map((item) => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="truncate font-medium">{item.name}</span><span className="whitespace-nowrap text-slate-400">{number(item.enrollments)} ลงทะเบียน · Progress {item.averageProgress}%</span></div><Progress value={item.enrollments / maxCategoryEnrollment * 100} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-cyan-400 to-violet-500" /></div>) : <EmptyState text="ยังไม่มีข้อมูลหมวดหมู่ในช่วงเวลานี้" />}</CardContent></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="border-white/10 bg-slate-950/50 text-white xl:col-span-3"><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-300" />คอร์สที่ควรเฝ้าดู</CardTitle><CardDescription className="text-slate-400">คอร์สที่มีการลงทะเบียนหรือการเรียนล่าสุด แต่มี progress เฉลี่ยต่ำกว่าอันดับอื่น</CardDescription></CardHeader><CardContent className="space-y-4">{data.courseFocus.length ? data.courseFocus.map((course) => <div key={course.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="font-medium">{course.title}</p><p className="text-xs text-slate-400">{number(course.enrollments)} ลงทะเบียน · จบ {number(course.completions)}</p></div><div className="mt-3 flex items-center gap-3"><Progress value={course.averageProgress} className="h-2 flex-1 bg-slate-800" indicatorClassName={course.averageProgress < 40 ? 'bg-amber-400' : 'bg-emerald-400'} /><span className="w-10 text-right text-sm font-semibold">{course.averageProgress}%</span></div></div>) : <EmptyState text="ยังไม่มีข้อมูลการเรียนที่ต้องเฝ้าดูในช่วงเวลานี้" />}</CardContent></Card>
        <Card className="border-white/10 bg-gradient-to-br from-violet-950/70 to-slate-950/80 text-white xl:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-fuchsia-300" />System Focus</CardTitle><CardDescription className="text-slate-400">สรุปสิ่งที่ควรใช้ตัดสินใจในรอบนี้</CardDescription></CardHeader><CardContent className="space-y-4"><FocusItem title="วันที่มีกิจกรรมสูงสุด" value={data.insights.peakDay || 'ยังไม่มีข้อมูล'} /><FocusItem title="หมวดหมู่ที่นำการลงทะเบียน" value={data.insights.topCategory || 'ยังไม่มีข้อมูล'} /><FocusItem title="ผู้เรียนที่อาจต้องติดตาม" value={`${number(metrics.atRiskLearners)} ราย`} emphasis={metrics.atRiskLearners > 0} /><FocusItem title="ใบรับรองที่ออกในช่วงนี้" value={`${number(metrics.certificatesIssued)} ใบ`} /></CardContent></Card>
      </section>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-700 px-6 text-center text-sm text-slate-400">{text}</div>
}

function FocusItem({ title, value, emphasis = false }: { title: string; value: string; emphasis?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-slate-400">{title}</p><p className={`mt-1 text-base font-semibold ${emphasis ? 'text-amber-200' : 'text-white'}`}>{value}</p></div>
}
