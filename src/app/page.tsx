'use client'

import Link from 'next/link'
import { useState } from 'react'
import { translations, Language } from '@/lib/i18n'

export default function HomePage() {
  const [lang, setLang] = useState<Language>('th')
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {t.header.title}
            </h1>
          </div>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('th')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                lang === 'th' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              🇹🇭
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                lang === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              🇬🇧
            </button>
            <button
              onClick={() => setLang('ja')}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                lang === 'ja' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              🇯🇵
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t.hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              {t.hero.loginBtn}
            </Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              {t.hero.registerBtn}
            </Link>
            <Link href="/skills-assessment" className="bg-white hover:bg-gray-50 text-gray-900 text-lg px-10 py-4 rounded-xl transition-all duration-200 border-2 border-gray-300 font-semibold">
              {t.hero.assessmentBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600">{t.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.features.skill.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{t.features.skill.desc}</p>
              <Link href="/skills-assessment" className="inline-block text-blue-600 hover:text-blue-700 font-semibold">
                {t.features.skill.link}
              </Link>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.features.course.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{t.features.course.desc}</p>
              <Link href="/courses" className="inline-block text-green-600 hover:text-green-700 font-semibold">
                {t.features.course.link}
              </Link>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.features.certificate.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{t.features.certificate.desc}</p>
              <Link href="/certificates" className="inline-block text-purple-600 hover:text-purple-700 font-semibold">
                {t.features.certificate.link}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
              {t.cta.loginBtn}
            </Link>
            <Link href="/skills-assessment" className="bg-white hover:bg-gray-50 text-gray-900 text-lg px-12 py-4 rounded-xl transition-all duration-200 border-2 border-gray-300 font-semibold">
              {t.cta.assessmentBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2024 upPowerSkill. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
