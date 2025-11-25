import AIPathGenerator from '@/components/learning-path/AIPathGenerator'

export default function AIPathGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Learning Path Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Let AI create your personalized learning journey
          </p>
        </div>
        
        <AIPathGenerator />
      </div>
    </div>
  )
}