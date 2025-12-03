import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, Video, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">SkillNexus</Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/career-pathway" className="text-gray-600 hover:text-gray-900 transition">Career Path</Link>
            <Link href="/systems" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
            <Link href="/login">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Learn Smarter,<br />Grow Faster
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered learning platform with career pathway planning, live classes, and blockchain certificates
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/career-pathway">
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 px-8">
                Explore Career Paths
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Pathway</h3>
              <p className="text-gray-600 text-sm">AI-powered career planning with 85%+ accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Classes</h3>
              <p className="text-gray-600 text-sm">Real-time streaming with interactive features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Assessment</h3>
              <p className="text-gray-600 text-sm">Comprehensive 8-dimension skill evaluation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by 10,000+ learners</h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of professionals advancing their careers with SkillNexus
          </p>
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600 mt-1">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to start learning?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join SkillNexus today and transform your career
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 px-8">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">SkillNexus</div>
            <div className="flex gap-8">
              <Link href="/career-pathway" className="text-gray-600 hover:text-gray-900 text-sm">Career Path</Link>
              <Link href="/systems" className="text-gray-600 hover:text-gray-900 text-sm">Features</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">Login</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
            © 2024 SkillNexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}