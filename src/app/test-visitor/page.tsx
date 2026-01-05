'use client';

import VisitorCounter from '@/components/visitor-counter';
import LiveVisitorStats from '@/components/live-visitor-stats';

export default function TestVisitorCounter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🧪 Visitor Counter Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Basic Counter</h2>
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 inline-block">
              <VisitorCounter />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Live Stats</h2>
            <div className="relative">
              <LiveVisitorStats />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">API Test</h2>
          <div className="space-y-4">
            <button 
              onClick={() => fetch('/api/visitor-count', { method: 'POST' }).then(() => window.location.reload())}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📈 Increment Counter
            </button>
            
            <button 
              onClick={() => fetch('/api/analytics/visitors').then(r => r.json()).then(data => alert(JSON.stringify(data, null, 2)))}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
            >
              📊 View Analytics
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🏠 กลับหน้าแรก
          </a>
          <a 
            href="/admin/analytics" 
            className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 ml-4"
          >
            📊 Analytics Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}