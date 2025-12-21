export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 mx-auto animate-pulse-slow shadow-2xl">
          <span className="text-white font-bold text-2xl">uP</span>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4 animate-fade-in-up">
          upPowerSkill
        </h2>
        <p className="text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          กำลังโหลดระบบ...
        </p>
        
        {/* Loading Spinner */}
        <div className="flex justify-center space-x-2 animate-fade-in-up animation-delay-400">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}