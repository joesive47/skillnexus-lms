import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Headphones, 
  Link2, 
  Building2, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Award,
  Users,
  BookOpen,
  Play,
  Eye,
  Globe,
  Cpu,
  Database
} from "lucide-react"

export default function Phase3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-lg px-6 py-2">
            🚀 Phase 3: Future Technology
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            อนาคตของการเรียนรู้
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            สัมผัสเทคโนโลยีล้ำสมัย VR/AR Learning, Blockchain Certificates, Enterprise Solutions และ Social Learning Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vr-learning">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4">
                <Headphones className="w-5 h-5 mr-2" />
                ทดลอง VR Learning
              </Button>
            </Link>
            <Link href="/blockchain">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                <Link2 className="w-5 h-5 mr-2" />
                ดู Blockchain Certs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">เทคโนโลยีแห่งอนาคต</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              ฟีเจอร์ล้ำสมัยที่จะเปลี่ยนแปลงวิธีการเรียนรู้ของคุณไปตลอดกาล
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* VR/AR Learning */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">VR/AR Learning Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  เรียนรู้ในโลกเสมือนจริง พร้อมประสบการณ์ 3D แบบ Immersive ที่จะทำให้คุณรู้สึกเหมือนอยู่ในสถานการณ์จริง
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Hand Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Spatial Audio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">3D Environments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Interactive Sims</span>
                  </div>
                </div>
                <Link href="/vr-learning">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    เริ่มประสบการณ์ VR
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Blockchain Certificates */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">Blockchain Certificates</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  ใบรับรองบน Blockchain ที่ไม่สามารถปลอมแปลงได้ พร้อมการตรวจสอบแบบ Real-time ทั่วโลก
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Tamper-Proof</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">IPFS Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Instant Verify</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Global Access</span>
                  </div>
                </div>
                <Link href="/blockchain">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    ดูใบรับรอง Blockchain
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Solutions */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-sm hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">Enterprise Solutions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  โซลูชันระดับองค์กร พร้อม Multi-tenant Architecture, SSO Integration และ Custom Branding
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Multi-Tenant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">SSO Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Custom Brand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">API Hub</span>
                  </div>
                </div>
                <Link href="/enterprise">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    สำรวจ Enterprise
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Social Learning */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-sm hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">Social Learning Platform</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  เรียนรู้แบบสังคม พร้อมชุมชน Study Groups, Forums และการแบ่งปันความรู้แบบ Peer-to-Peer
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Study Groups</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Forums</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Peer Learning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Live Sessions</span>
                  </div>
                </div>
                <Link href="/social-learning">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    เข้าร่วมชุมชน
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">ผลกระทบที่คาดหวัง</h2>
            <p className="text-gray-300 text-lg">เทคโนโลยีเหล่านี้จะเปลี่ยนแปลงการเรียนรู้อย่างไร</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">+400%</div>
                <div className="text-white font-semibold mb-1">VR Retention</div>
                <div className="text-gray-400 text-sm">การจดจำในสภาพแวดล้อม VR</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-white font-semibold mb-1">Blockchain Security</div>
                <div className="text-gray-400 text-sm">ความปลอดภัยของใบรับรอง</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">100K+</div>
                <div className="text-white font-semibold mb-1">Enterprise Users</div>
                <div className="text-gray-400 text-sm">ผู้ใช้ต่อองค์กร</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-orange-400 mb-2">+600%</div>
                <div className="text-white font-semibold mb-1">Social Engagement</div>
                <div className="text-gray-400 text-sm">การมีส่วนร่วมในชุมชน</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">พร้อมสัมผัสอนาคตแล้วหรือยัง?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับการปฏิวัติการเรียนรู้ด้วยเทคโนโลยีล้ำสมัยที่จะเปลี่ยนแปลงชีวิตคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12 py-4">
                เริ่มต้นเลย
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-12 py-4">
                ดู Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">SkillNexus Phase 3</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 SkillNexus LMS Phase 3. Future Technology Pioneer.
          </p>
        </div>
      </footer>
    </div>
  )
}