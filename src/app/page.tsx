'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, ChevronRight,
  GraduationCap, Languages, PlayCircle, Sparkles,
} from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'เรียนเป็นเส้นทาง', text: 'จัดบทเรียน วิดีโอ แบบทดสอบ และ SCORM ให้ต่อเนื่องในหลักสูตรเดียว', color: 'from-cyan-400 to-blue-500' },
  { icon: BarChart3, title: 'เห็นความก้าวหน้าจริง', text: 'ติดตามการเรียน คะแนน และสถานะสำเร็จ เพื่อรู้ว่าควรพัฒนาตรงไหนต่อ', color: 'from-violet-400 to-fuchsia-500' },
  { icon: Award, title: 'รับรองผลสำเร็จ', text: 'ตรวจเงื่อนไขการเรียนและออกใบรับรองที่ตรวจสอบย้อนกลับได้', color: 'from-amber-400 to-orange-500' },
]

export default function HomePage() {
  const [certificates, setCertificates] = useState(0)

  useEffect(() => {
    fetch('/api/stats?t=' + Date.now()).then(response => response.ok ? response.json() : null)
      .then(data => data && setCertificates(data.certificates ?? 0)).catch(() => undefined)
  }, [])

  return (
    <main data-runall-home className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-cyan-500/20 blur-[110px]" />
        <div className="absolute right-[-8rem] top-[-5rem] h-[34rem] w-[34rem] rounded-full bg-violet-500/20 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-[#07111f]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span><strong className="block text-lg tracking-tight">SkillNexus</strong><small className="text-xs text-slate-400">Learning without limits</small></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">จุดเด่น</a>
            <Link href="/courses" className="transition hover:text-white">หลักสูตร</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">เข้าสู่ระบบ</Link>
            <Link href="/register" className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50 sm:block">เริ่มเรียนฟรี</Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.12fr_.88fr] lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4" /> แพลตฟอร์มพัฒนาทักษะสำหรับการเรียนรู้ยุคใหม่
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.08] tracking-[-0.04em] md:text-7xl">
            เปลี่ยนทุกการเรียนรู้<br />ให้เป็น<span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">ทักษะที่วัดผลได้</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">เรียนตามเส้นทางที่เหมาะกับคุณ ทำแบบทดสอบ ติดตามความก้าวหน้า และรับใบรับรองในพื้นที่เดียว</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5">
              <PlayCircle className="h-5 w-5" /> เข้าสู่ระบบเพื่อเริ่มเรียน <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/skills-assessment" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10">ประเมินทักษะของฉัน <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
            {['เส้นทางเรียนชัดเจน', 'ติดตามผลแบบเรียลไทม์', 'ใบรับรองตรวจสอบได้'].map(item => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</span>)}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl md:p-7">
            <div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">ภาพรวมการเรียนรู้</p><h2 className="mt-1 text-2xl font-bold">พร้อมเติบโตไปอีกขั้น</h2></div><span className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300"><BarChart3 /></span></div>
            <div className="mt-7 rounded-2xl border border-white/10 bg-[#0b1729]/80 p-5">
              <div className="flex justify-between text-sm"><span className="text-slate-300">ความก้าวหน้าโดยรวม</span><b className="text-cyan-300">72%</b></div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" /></div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[['12','บทเรียน'],['4','แบบทดสอบ'],['2','ใบรับรอง']].map(([value,label]) => <div key={label} className="rounded-xl bg-white/5 p-3"><strong className="block text-xl">{value}</strong><span className="text-xs text-slate-400">{label}</span></div>)}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-400/20"><Award className="text-violet-200" /></span><div><p className="font-semibold">เป้าหมายถัดไป</p><p className="text-sm text-slate-400">ผ่านแบบทดสอบปลายหลักสูตร</p></div><ChevronRight className="ml-auto text-slate-500" /></div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-white/10 bg-white/[0.035] py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="max-w-2xl"><p className="font-semibold text-cyan-300">ครบตั้งแต่เริ่มเรียนจนสำเร็จ</p><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">เครื่องมือที่ช่วยให้การเรียน<br />เดินหน้าอย่างมีเป้าหมาย</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({icon: Icon,title,text,color}) => <article key={title} className="group rounded-3xl border border-white/10 bg-[#0a1627] p-7 transition hover:-translate-y-1 hover:border-white/20"><span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}><Icon className="h-6 w-6" /></span><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 text-sm text-slate-500 md:flex-row md:px-8"><div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-cyan-400" /><b className="text-slate-300">SkillNexus LMS</b></div><div className="flex gap-6">{certificates > 0 && <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> ใบรับรอง {certificates.toLocaleString()}</span>}<span className="hidden items-center gap-1.5 sm:flex"><Languages className="h-4 w-4" /> ภาษาไทย</span></div></div></section>
    </main>
  )
}
