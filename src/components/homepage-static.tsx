import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Target, 
  BookOpen, 
  Rocket, 
  ArrowRight, 
  Star, 
  Users, 
  Award,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Brain,
  Trophy,
  Play,
  GraduationCap,
  BarChart3,
  Cpu,
  Infinity
} from "lucide-react"

// Predefined particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 10.5, top: 20.3, delay: 0.5, duration: 3.2 },
  { left: 85.2, top: 15.7, delay: 1.2, duration: 4.1 },
  { left: 45.8, top: 75.4, delay: 2.1, duration: 2.8 },
  { left: 92.1, top: 60.2, delay: 0.8, duration: 3.7 },
  { left: 15.3, top: 85.9, delay: 1.8, duration: 2.5 },
  { left: 70.6, top: 25.1, delay: 0.3, duration: 4.3 },
  { left: 35.9, top: 90.7, delay: 2.5, duration: 3.1 },
  { left: 88.4, top: 40.8, delay: 1.1, duration: 2.9 },
  { left: 25.7, top: 55.3, delay: 0.7, duration: 3.8 },
  { left: 65.2, top: 10.6, delay: 1.9, duration: 2.7 },
];

export function StaticHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLE_POSITIONS.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/20 shadow-2xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                SkillNexus
              </h1>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                AI-Powered Learning Platform
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="backdrop-blur-sm bg-white/10 border-white/30 hover:bg-white/20 text-white">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                เริ่มต้นเลย
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20 rounded-full px-6 py-3 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 animate-pulse text-yellow-400" />
            <span className="font-medium">Enterprise-Grade AI Learning Platform</span>
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold mb-12 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            SkillNexus
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 mb-16 max-w-4xl mx-auto leading-relaxed">
            แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร
            <br />
            <span className="text-lg text-gray-300">เรียนรู้ • ฝึกฝน • รับรอง • สำเร็จ</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group border-0">
                <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                เข้าสู่ระบบ
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Link href="/skills-assessment">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-xl px-12 py-6 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 group">
                <Target className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                ทดสอบทักษะ
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-3xl p-8 mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 hover:bg-blue-500/30">
                <Users className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">100K+</div>
              </div>
              <div className="text-gray-300 font-medium">ผู้เรียนที่ใช้งาน</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-3xl p-8 mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 hover:bg-green-500/30">
                <BookOpen className="w-10 h-10 text-green-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">1000+</div>
              </div>
              <div className="text-gray-300 font-medium">คอร์สเรียนคุณภาพ</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-8 mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 hover:bg-purple-500/30">
                <TrendingUp className="w-10 h-10 text-purple-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">98%</div>
              </div>
              <div className="text-gray-300 font-medium">อัตราความสำเร็จ</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-3xl p-8 mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 hover:bg-cyan-500/30">
                <Cpu className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
              </div>
              <div className="text-gray-300 font-medium">AI ช่วยเหลือ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-3 border border-white/20">
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-white font-medium text-lg">ฟีเจอร์หลัก</span>
            </div>
            <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-8">
              เครื่องมือที่ทรงพลัง
            </h2>
          </div>
          
          {/* Quick Access Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-24">
            <Link href="/skills-assessment" className="group">
              <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transform hover:scale-105 hover:-rotate-1 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-white text-lg">ทดสอบทักษะ</h3>
                  <p className="text-sm text-gray-300">วิเคราะห์ความสามารถ</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/courses" className="group">
              <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-green-400/30 bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 transform hover:scale-105 hover:rotate-1 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-18 h-18 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-white text-lg">คอร์สเรียน</h3>
                  <p className="text-sm text-gray-300">เรียนรู้ทักษะใหม่</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/certificates" className="group">
              <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 transform hover:scale-105 hover:-rotate-1 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-white text-lg">ใบรับรอง</h3>
                  <p className="text-sm text-gray-300">รับรองความสามารถ</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/ai-learning" className="group">
              <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-orange-400/30 bg-gradient-to-br from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 transform hover:scale-105 hover:rotate-1 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-18 h-18 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-white text-lg">AI ผู้ช่วย</h3>
                  <p className="text-sm text-gray-300">เรียนรู้อัจฉริยะ</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/analytics" className="group">
              <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20 hover:to-cyan-600/20 transform hover:scale-105 hover:-rotate-1 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-18 h-18 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold mb-3 text-white text-lg">วิเคราะห์ผล</h3>
                  <p className="text-sm text-gray-300">ติดตามความก้าวหน้า</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <Rocket className="w-6 h-6 text-white animate-bounce" />
            <span className="text-white font-medium text-lg">เริ่มต้นการเรียนรู้</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
            เข้าร่วมกับผู้คนหลายพันคนที่กำลังสร้างอนาคตที่สดใส
            <br />
            ผ่านแพลตฟอร์มของเรา
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto mb-16">
            <Link href="/login" className="group">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 text-xl px-12 py-8 w-full rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group border-0">
                <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                เข้าสู่ระบบ
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/skills-assessment" className="group">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-xl px-12 py-8 w-full rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                <Target className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                ทดสอบทักษะ
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <p className="text-white text-lg font-medium">ปลอดภัย 100%</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <p className="text-white text-lg font-medium">มาตรฐานสากล</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Infinity className="w-10 h-10 text-white" />
              </div>
              <p className="text-white text-lg font-medium">เรียนรู้ไม่จำกัด</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <p className="text-white text-lg font-medium">รับรองคุณภาพ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-br from-slate-900 to-black py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6 group">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <GraduationCap className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <span className="text-white font-bold text-2xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  SkillNexus
                </span>
                <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                  <Cpu className="w-4 h-4" />
                  AI-Powered Learning Platform
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 flex items-center justify-center gap-2 text-lg">
              © 2024 SkillNexus Education Technology. 
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                เสริมพลังการเรียนรู้ของคุณ
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}