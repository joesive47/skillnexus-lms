export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 border border-white/30 shadow-2xl">
        <h1 className="text-6xl font-bold text-white text-center mb-8">
          Tailwind Test
        </h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-red-500 h-20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">Red</span>
          </div>
          <div className="bg-green-500 h-20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">Green</span>
          </div>
          <div className="bg-blue-500 h-20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">Blue</span>
          </div>
        </div>
        <button className="w-full mt-8 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-4 rounded-2xl hover:scale-105 transition-transform duration-300">
          Test Button
        </button>
      </div>
    </div>
  )
}