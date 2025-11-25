'use client'

import { useState } from 'react'
import { Play, MoreVertical, Trash2, Download, Share } from 'lucide-react'

interface WatchItem {
  id: string
  title: string
  thumbnail: string
  progress: number
  lastWatched: string
  duration: string
  category: string
}

const watchHistory: WatchItem[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    thumbnail: 'https://via.placeholder.com/160x90/1f2937/ffffff?text=React',
    progress: 75,
    lastWatched: '2 hours ago',
    duration: '45m',
    category: 'Frontend'
  },
  {
    id: '2',
    title: 'JavaScript ES6+ Features',
    thumbnail: 'https://via.placeholder.com/160x90/f7df1e/000000?text=JavaScript',
    progress: 100,
    lastWatched: '1 day ago',
    duration: '1h 20m',
    category: 'Programming'
  },
  {
    id: '3',
    title: 'CSS Grid Layout Mastery',
    thumbnail: 'https://via.placeholder.com/160x90/1572b6/ffffff?text=CSS',
    progress: 45,
    lastWatched: '3 days ago',
    duration: '55m',
    category: 'Frontend'
  }
]

export default function WatchHistory() {
  const [items, setItems] = useState(watchHistory)
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const removeFromHistory = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    setShowMenu(null)
  }

  const continueWatching = (item: WatchItem) => {
    console.log('Continue watching:', item.title)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">📺 Continue Watching</h2>
        <button className="text-gray-400 hover:text-white text-sm">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => continueWatching(item)}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                >
                  <Play className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Progress Badge */}
              {item.progress === 100 ? (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  ✓ Completed
                </div>
              ) : (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {item.progress}%
                </div>
              )}

              {/* Menu Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                  className="bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>

                {/* Dropdown Menu */}
                {showMenu === item.id && (
                  <div className="absolute top-8 right-0 bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-10">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button 
                      onClick={() => removeFromHistory(item.id)}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove from History</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{item.title}</h3>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{item.category}</span>
                <span>{item.duration}</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Last watched {item.lastWatched}
              </div>

              <button
                onClick={() => continueWatching(item)}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{item.progress === 100 ? 'Watch Again' : 'Continue'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-white mb-2">No watch history yet</h3>
          <p className="text-gray-400">Start learning to see your progress here</p>
        </div>
      )}
    </div>
  )
}