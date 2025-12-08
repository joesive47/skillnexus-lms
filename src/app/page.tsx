"use client"

import Link from "next/link"
import { Lightbulb, Target, BookOpen, Rocket, ArrowRight, Users, CheckCircle, Star } from "lucide-react"
import UnifiedChatWidget from "@/components/chatbot/UnifiedChatWidget"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <header className="border-b border-yellow-200/50 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/uploads/picture/logoupPowerskill.png" 
              alt="upPowerSkill Logo" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
                upPowerSkill
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Learning Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition">
                เข้าสู่ระบบ
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-gradient-to-r from-yellow-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-yellow-600 hover:to-blue-700 transition">
                เริ่มต้นเลย
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src="/uploads/picture/logoupPowerskill.png" 
              alt="upPowerSkill Logo" 
              className="h-32 w-auto object-contain animate-pulse"
            />
          </div>
          
          <div className="mb-6 inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 text-sm font-medium">
            🌟 Global Learning Management System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
            upPowerSkill
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-yellow-600">Learn</span> → 
            <span className="font-semibold text-orange-500"> Practice</span> → 
            <span className="font-semibold text-blue-600"> Certify</span> → 
            <span className="font-semibold text-green-600"> Succeed</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <button className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-lg font-medium transition flex items-center justify-center">
                <Target className="w-5 h-5 mr-2" />
                เข้าสู่ระบบ
              </button>
            </Link>
            <Link href="/register">
              <button className="border border-blue-300 text-blue-700 hover:bg-blue-50 text-lg px-8 py-4 rounded-lg font-medium transition flex items-center justify-center">
                <BookOpen className="w-5 h-5 mr-2" />
                เรียนฟรี
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-gray-600 text-sm">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
              <div className="text-gray-600 text-sm">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">95%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-gray-600 text-sm">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🌟 How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Clear path to success with transparency and maximum efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Learn</h3>
              <p className="text-gray-600">
                Master essential skills through specially designed courses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Practice</h3>
              <p className="text-gray-600">
                Take assessments and receive verifiable certificates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Get Opportunities</h3>
              <p className="text-gray-600">
                Smart matching system for opportunities that fit your skills
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. Build Future</h3>
              <p className="text-gray-600">
                Start your business or invest with confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-yellow-100 to-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">🚀 Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of people creating a bright future through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link href="/login">
              <button className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white text-lg px-6 py-4 rounded-lg font-medium transition flex items-center justify-center w-full">
                เข้าสู่ระบบ
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <Link href="/register">
              <button className="border border-blue-300 text-blue-700 hover:bg-blue-50 text-lg px-6 py-4 rounded-lg font-medium transition flex items-center justify-center w-full">
                เรียนฟรี
                <BookOpen className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/uploads/picture/logoupPowerskill.png" 
              alt="upPowerSkill Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-gray-800 font-semibold text-lg">upPowerSkill</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 upPowerSkill Education Technology. Empower Your Learning Journey.
          </p>
        </div>
      </footer>
      
      {/* AI Chatbot Widget */}
      <UnifiedChatWidget />
    </div>
  )
}