'use client'

import Link from 'next/link'
import { useState } from 'react'
import { translations, Language } from '@/lib/i18n'

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('th')
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {t.header.title}
            </h1>
          </div>
          
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            <span className="text-xl">{lang === 'th' ? '🇹🇭' : '🇬🇧'}</span>
            <span className="font-medium">{lang === 'th' ? 'TH' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t.hero.subtitle}<br/>
            <span className="text-lg text-blue-300">{t.hero.description}</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              {t.hero.loginBtn}
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl px-12 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              {t.hero.registerBtn}
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-xl px-12 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              {t.hero.assessmentBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-300">{t.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.features.skill.title}</h3>
              <p className="text-gray-300 leading-relaxed">{t.features.skill.desc}</p>
              <Link href="/skills-assessment" className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                {t.features.skill.link}
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.features.course.title}</h3>
              <p className="text-gray-300 leading-relaxed">{t.features.course.desc}</p>
              <Link href="/courses" className="inline-block mt-4 text-green-400 hover:text-green-300 transition-colors">
                {t.features.course.link}
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.features.certificate.title}</h3>
              <p className="text-gray-300 leading-relaxed">{t.features.certificate.desc}</p>
              <Link href="/certificates" className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors">
                {t.features.certificate.link}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            {t.cta.title}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login" className="bg-white text-purple-600 text-xl px-12 py-4 rounded-3xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold">
              {t.cta.loginBtn}
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-xl px-12 py-4 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold">
              {t.cta.assessmentBtn}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


