'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, ChevronRight,
  GraduationCap, Languages, Menu, PlayCircle, Sparkles, X,
} from 'lucide-react'

const features = [
  { icon: BookOpen, title: 'เรียนเป็นเส้นทาง', text: 'จัดบทเรียน วิดีโอ แบบทดสอบ และ SCORM ให้ต่อเนื่องในหลักสูตรเดียว', color: 'from-cyan-400 to-blue-500' },
  { icon: BarChart3, title: 'เห็นความก้าวหน้าจริง', text: 'ติดตามการเรียน คะแนน และสถานะสำเร็จ เพื่อรู้ว่าควรพัฒนาตรงไหนต่อ', color: 'from-violet-400 to-fuchsia-500' },
  { icon: Award, title: 'รับรองผลสำเร็จ', text: 'ตรวจเงื่อนไขการเรียนและออกใบรับรองที่ตรวจสอบย้อนกลับได้', color: 'from-amber-400 to-orange-500' },
]

export default function HomePage() {
  const [certificates, setCertificates] = useState(0)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    fetch('/api/stats?t=' + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setCertificates(d.certificates ?? 0))
      .catch(() => undefined)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07111f] text-white">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px] sm:h-96 sm:w-96 sm:blur-[110px]" />
        <div className="absolute right-[-4rem] top-[-3rem] h-72 w-72 rounded-full bg-violet-500/20 blur-[100px] sm:h-[34rem] sm:w-[34rem] sm:blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/20 sm:h-11 sm:w-11 sm:rounded-2xl">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span>
              <strong className="block text-base leading-tight tracking-tight sm:text-lg">SkillNexus</strong>
              <small className="hidden text-xs text-slate-400 sm:block">Learning without limits</small>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">จุดเด่น</a>
            <Link href="/courses" className="transition hover:text-white">หลักสูตร</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">เข้าสู่ระบบ</Link>
            <Link href="/register" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50">เริ่มเรียนฟรี</Link>
          </div>

          {/* Mobile: login + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">เข้าสู่ระบบ</Link>
            <button onClick={() => setNavOpen(o => !o)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="Toggle menu">
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {navOpen && (
          <div className="border-t border-white/10 bg-[#07111f]/95 px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-1 text-sm">
              <a href="#features" onClick={() => setNavOpen(false)} className="rounded-lg px-3 py-2.5 text-slate-300 hover:bg-white/10">จุดเด่น</a>
              <Link href="/courses" onClick={() => setNavOpen(false)} className="rounded-lg px-3 py-2.5 text-slate-300 hover:bg-white/10">หลักสูตร</Link>
              <Link href="/register" onClick={() => setNavOpen(false)} className="mt-2 rounded-xl bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-900">เริ่มเรียนฟรี</Link>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:px-8 lg:grid-cols-[1.12fr_.88fr] lg:gap-14 lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200 sm:px-4 sm:py-2 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            แพลตฟอร์มพัฒนาทักษะสำหรับการเรียนรู้ยุคใหม่
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
            เปลี่ยนทุกการเรียนรู้<br />
            ให้เป็น<span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">ทักษะที่วัดผลได้</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-7 sm:text-lg sm:leading-8 md:text-xl">
            เรียนตามเส้นทางที่เหมาะกับคุณ ทำแบบทดสอบ ติดตามความก้าวหน้า และรับใบรับรองในพื้นที่เดียว
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Link href="/login" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 sm:px-7 sm:py-4">
              <PlayCircle className="h-5 w-5" />
              เข้าสู่ระบบเพื่อเริ่มเรียน
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/skills-assessment" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:px-7 sm:py-4">
              ประเมินทักษะของฉัน
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400 sm:gap-x-7 sm:text-sm">
            {['เส้นทางเรียนชัดเจน', 'ติดตามผลแบบเรียลไทม์', 'ใบรับรองตรวจสอบได้'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-2xl sm:-inset-6 sm:rounded-[2.5rem]" />
          <div className="relative rounded-2xl border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl sm:rounded-[2rem] sm:p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 sm:text-sm">ภาพรวมการเรียนรู้</p>
                <h2 className="mt-1 text-lg font-bold sm:text-2xl">พร้อมเติบโตไปอีกขั้น</h2>
              </div>
              <span className="rounded-xl bg-emerald-400/15 p-2.5 text-emerald-300 sm:rounded-2xl sm:p-3">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-[#0b1729]/80 p-4 sm:mt-7 sm:rounded-2xl sm:p-5">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-300">ความก้าวหน้าโดยรวม</span>
                <b className="text-cyan-300">72%</b>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10 sm:mt-3 sm:h-2.5">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:mt-6 sm:gap-3">
                {[['12','บทเรียน'],['4','แบบทดสอบ'],['2','ใบรับรอง']].map(([value,label]) => (
                  <div key={label} className="rounded-lg bg-white/5 p-2 sm:rounded-xl sm:p-3">
                    <strong className="block text-lg sm:text-xl">{value}</strong>
                    <span className="text-[10px] text-slate-400 sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-violet-300/15 bg-violet-400/10 p-3 sm:mt-4 sm:gap-4 sm:rounded-2xl sm:p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-400/20 sm:h-12 sm:w-12">
                <Award className="h-5 w-5 text-violet-200 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm sm:text-base">เป้าหมายถัดไป</p>
                <p className="truncate text-xs text-slate-400">ผ่านแบบทดสอบปลายหลักสูตร</p>
              </div>
              <ChevronRight className="ml-auto shrink-0 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 border-y border-white/10 bg-white/[0.035] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl">
            <p className="font-semibold text-cyan-300 text-sm sm:text-base">ครบตั้งแต่เริ่มเรียนจนสำเร็จ</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl md:text-5xl">
              เครื่องมือที่ช่วยให้การเรียน<br className="hidden sm:block" />
              เดินหน้าอย่างมีเป้าหมาย
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text, color }) => (
              <article key={title} className="group rounded-2xl border border-white/10 bg-[#0a1627] p-5 transition hover:-translate-y-1 hover:border-white/20 sm:rounded-3xl sm:p-7">
                <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${color} shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold sm:mt-6 sm:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400 sm:mt-3 sm:leading-7">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <section className="relative z-10 border-t border-white/10 py-8 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-sm md:px-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-cyan-400 sm:h-5 sm:w-5" />
            <b className="text-slate-300">SkillNexus LMS</b>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {certificates > 0 && (
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                ใบรับรอง {certificates.toLocaleString()}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              ภาษาไทย
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
