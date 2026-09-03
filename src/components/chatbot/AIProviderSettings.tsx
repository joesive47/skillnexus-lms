'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bot, CheckCircle2, KeyRound, Loader2, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type ProviderName = 'OPENAI' | 'GEMINI'
type ProviderView = {
  provider: ProviderName
  model: string
  enabled: boolean
  isDefault: boolean
  monthlyTokenLimit: number
  requestsPerMinute: number
  keyConfigured: boolean
  maskedKey: string
  lastTestedAt?: string | null
  lastTestStatus?: string | null
  usage?: { _sum: { inputTokens: number | null; outputTokens: number | null }; _count: { id: number } } | null
}

const defaults: Record<ProviderName, string> = { OPENAI: 'gpt-4o-mini', GEMINI: 'gemini-2.0-flash' }

export function AIProviderSettings() {
  const [providers, setProviders] = useState<ProviderView[]>([])
  const [provider, setProvider] = useState<ProviderName>('OPENAI')
  const [model, setModel] = useState(defaults.OPENAI)
  const [apiKey, setApiKey] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [isDefault, setIsDefault] = useState(true)
  const [monthlyTokenLimit, setMonthlyTokenLimit] = useState(1_000_000)
  const [requestsPerMinute, setRequestsPerMinute] = useState(20)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/ai-providers', { cache: 'no-store' })
    if (!response.ok) throw new Error('โหลดการตั้งค่า AI Provider ไม่สำเร็จ')
    const data = await response.json()
    setProviders(Array.isArray(data.providers) ? data.providers : [])
  }, [])

  useEffect(() => { void load().catch(error => setMessage(error.message)) }, [load])

  useEffect(() => {
    const saved = providers.find(item => item.provider === provider)
    setModel(saved?.model || defaults[provider])
    setEnabled(saved?.enabled || false)
    setIsDefault(saved?.isDefault ?? providers.length === 0)
    setMonthlyTokenLimit(saved?.monthlyTokenLimit || 1_000_000)
    setRequestsPerMinute(saved?.requestsPerMinute || 20)
    setApiKey('')
  }, [provider, providers])

  const selected = providers.find(item => item.provider === provider)
  const usedTokens = selected?.usage ? (selected.usage._sum.inputTokens || 0) + (selected.usage._sum.outputTokens || 0) : 0

  const save = async () => {
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/admin/ai-providers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model, apiKey: apiKey || undefined, enabled, isDefault, monthlyTokenLimit, requestsPerMinute }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ')
      setMessage('บันทึกแบบเข้ารหัสเรียบร้อยแล้ว')
      await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ') }
    finally { setBusy(false) }
  }

  const testConnection = async () => {
    setBusy(true); setMessage('')
    try {
      const response = await fetch('/api/admin/ai-providers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'ทดสอบการเชื่อมต่อไม่สำเร็จ')
      setMessage(`เชื่อมต่อสำเร็จ (${data.latencyMs} ms)`)
      await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'ทดสอบไม่สำเร็จ') }
    finally { setBusy(false) }
  }

  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-blue-600" /> AI Provider Gateway</CardTitle>
        <CardDescription>เชื่อมต่อโมเดลภายนอกโดยเก็บ API key แบบ AES-256-GCM ฝั่งเซิร์ฟเวอร์ พร้อม quota และ Knowledge Base fallback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div><Label htmlFor="ai-provider">Provider</Label><select id="ai-provider" value={provider} onChange={event => { setMessage(''); setProvider(event.target.value as ProviderName) }} className="mt-1 h-10 w-full rounded-md border bg-background px-3"><option value="OPENAI">OpenAI</option><option value="GEMINI">Google Gemini</option></select></div>
          <div><Label htmlFor="ai-model">Model</Label><Input id="ai-model" className="mt-1" value={model} onChange={event => setModel(event.target.value)} /></div>
          <div><Label htmlFor="ai-key">API key {selected?.keyConfigured && `(${selected.maskedKey})`}</Label><div className="relative mt-1"><KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="ai-key" type="password" autoComplete="new-password" className="pl-9" value={apiKey} onChange={event => setApiKey(event.target.value)} placeholder={selected?.keyConfigured ? 'เว้นว่างเพื่อใช้ key เดิม' : 'กรอก API key'} /></div></div>
          <div className="grid grid-cols-2 gap-3"><div><Label htmlFor="ai-rpm">Requests/min</Label><Input id="ai-rpm" type="number" min={1} max={300} className="mt-1" value={requestsPerMinute} onChange={event => setRequestsPerMinute(Number(event.target.value))} /></div><div><Label htmlFor="ai-budget">Token/month</Label><Input id="ai-budget" type="number" min={1000} className="mt-1" value={monthlyTokenLimit} onChange={event => setMonthlyTokenLimit(Number(event.target.value))} /></div></div>
        </div>
        <div className="flex flex-wrap items-center gap-6"><label className="flex items-center gap-2 text-sm"><Switch checked={enabled} onCheckedChange={setEnabled} /> เปิดใช้งาน</label><label className="flex items-center gap-2 text-sm"><Switch checked={isDefault} onCheckedChange={setIsDefault} /> Provider หลัก</label><span className="text-sm text-muted-foreground">ใช้เดือนนี้ {usedTokens.toLocaleString()} / {monthlyTokenLimit.toLocaleString()} tokens · {selected?.usage?._count.id || 0} requests</span>{selected?.lastTestStatus === 'SUCCESS' && <span className="flex items-center gap-1 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Connection verified</span>}</div>
        <div className="flex flex-wrap items-center gap-3"><Button type="button" onClick={save} disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}บันทึก Provider</Button><Button type="button" variant="outline" onClick={testConnection} disabled={busy || !selected?.keyConfigured}><ShieldCheck className="mr-2 h-4 w-4" />ทดสอบการเชื่อมต่อ</Button>{message && <span className="text-sm text-muted-foreground">{message}</span>}</div>
      </CardContent>
    </Card>
  )
}
