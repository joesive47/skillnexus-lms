import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Shield, 
  Award, 
  Users, 
  Play, 
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Headphones,
  Link2,
  Building2,
  MessageSquare,
  Brain,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SkillWorld Nexus</h1>
          </div>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="container mx-auto px-4 py-20 text-center relative">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            🚀 เฟส 3: VR/AR + Blockchain + Enterprise + Social Learning
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            SkillWorld Nexus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            ระบบจัดการการเรียนรู้แห่งอนาคต พร้อม VR/AR Learning, Blockchain Certificates, 
            Enterprise Solutions และ Social Learning Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                เริ่มเรียนฟรี
              </Button>
            </Link>
            <Link href="/phase3">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                สำรวจเฟส 3
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-gray-400 text-sm">ผู้เรียน</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-400 text-sm">คอร์สเรียน</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-gray-400 text-sm">ความพึงพอใจ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">สนับสนุน</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">ทำไมต้องเลือก SkillWorld Nexus?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              เทคโนโลยีล้ำสมัยและฟีเจอร์ครบครันเพื่อการเรียนรู้ที่มีประสิทธิภาพสูงสุด
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">VR/AR Learning</h3>
                <p className="text-gray-300 text-sm">
                  เรียนรู้ในโลกเสมือนจริง พร้อมประสบการณ์ 3D แบบ Immersive
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Link2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Blockchain Certificates</h3>
                <p className="text-gray-300 text-sm">
                  ใบรับรองบน Blockchain ที่ไม่สามารถปลอมแปลงได้
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Enterprise Solutions</h3>
                <p className="text-gray-300 text-sm">
                  โซลูชันระดับองค์กร พร้อม Multi-tenant และ SSO
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Social Learning</h3>
                <p className="text-gray-300 text-sm">
                  เรียนรู้แบบสังคม พร้อมชุมชนและการแบ่งปันความรู้
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">เรียนรู้อย่างมีประสิทธิภาพ</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">การเรียนรู้แบบ Interactive</h3>
                    <p className="text-gray-300">ระบบการเรียนรู้แบบโต้ตอบที่ทำให้คุณมีส่วนร่วมตลอดเวลา</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">ติดตามความก้าวหน้า</h3>
                    <p className="text-gray-300">ระบบติดตามผลการเรียนแบบ Real-time พร้อม Analytics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">เรียนได้ทุกที่ทุกเวลา</h3>
                    <p className="text-gray-300">รองรับการเรียนรู้บนทุกอุปกรณ์ พร้อม Offline Mode</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-sm text-gray-300">อัตราผ่าน</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">5x</div>
                    <div className="text-sm text-gray-300">เร็วกว่าเดิม</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-300">ช่วยเหลือ</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">4.9</div>
                    <div className="text-sm text-gray-300">คะแนน</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">พร้อมเริ่มต้นการเรียนรู้แล้วหรือยัง?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับผู้เรียนหลายพันคนที่เลือกใช้ SkillNexus เพื่อพัฒนาทักษะและสร้างอาชีพที่ประสบความสำเร็จ
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12 py-4">
              เริ่มเรียนฟรีวันนี้
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">SkillWorld Nexus</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 SkillWorld Nexus LMS. สงวนลิขสิทธิ์ทุกประการ.
          </p>
        </div>
      </footer>
    </div>
  )
}