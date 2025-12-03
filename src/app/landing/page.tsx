import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Award, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Enterprise Learning Platform
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Power Up Your Skills
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8">
            Transform your career with AI-powered learning.<br/>
            100,000+ professionals trust upPowerSkill.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Browse Courses
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>99.99% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>BARD Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* For Students */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">For Students</h2>
              <p className="text-xl text-gray-600 mb-8">
                Learn at your own pace with AI-powered recommendations.
              </p>
              <ul className="space-y-4">
                {['AI Learning Paths', 'Interactive Videos', 'Progress Tracking', 'BARD Certificates', 'Mobile App', '24/7 AI Support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-lg">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button size="lg" className="mt-8">Start Learning Free</Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 text-center">
              <Users className="w-24 h-24 mx-auto text-blue-600 mb-6" />
              <h3 className="text-3xl font-bold mb-4">50,000+</h3>
              <p className="text-xl text-gray-600">Active Learners</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Corporates */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-12 text-center">
              <Globe className="w-24 h-24 mx-auto text-purple-600 mb-6" />
              <h3 className="text-3xl font-bold mb-4">500+</h3>
              <p className="text-xl text-gray-600">Enterprise Clients</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">For Corporates</h2>
              <p className="text-xl text-gray-600 mb-8">
                Upskill your workforce with enterprise LMS.
              </p>
              <ul className="space-y-4">
                {['Multi-Tenant', 'SSO Integration', 'White-Label', 'Analytics', 'API & Webhooks', 'Account Manager'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                    <span className="text-lg">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/enterprise">
                <Button size="lg" className="mt-8 bg-purple-600">Request Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Power Up Your Skills?</h2>
          <p className="text-xl mb-8 opacity-90">Join 100,000+ professionals</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-purple-600 px-8 py-6 text-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
