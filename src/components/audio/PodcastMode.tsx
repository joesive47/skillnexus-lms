'use client'

import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Headphones, Moon, Sun } from 'lucide-react'

interface Episode {
  id: string
  title: string
  description: string
  duration: string
  instructor: string
  category: string
  audioUrl: string
}

const episodes: Episode[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals Explained',
    description: 'Deep dive into closures, hoisting, and the event loop',
    duration: '45:30',
    instructor: 'Sarah Chen',
    category: 'Programming',
    audioUrl: '/audio/js-fundamentals.mp3'
  },
  {
    id: '2',
    title: 'React Hooks in Practice',
    description: 'Real-world examples of useState, useEffect, and custom hooks',
    duration: '38:15',
    instructor: 'Mike Johnson',
    category: 'Frontend',
    audioUrl: '/audio/react-hooks.mp3'
  }
]

export default function PodcastMode() {
  const [currentEpisode, setCurrentEpisode] = useState(episodes[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Headphones className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold">🎧 Podcast Learning</h1>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Now Playing */}
        <div className={`rounded-2xl p-8 mb-8 ${
          isDarkMode ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-purple-200 to-blue-200'
        }`}>
          <div className="text-center mb-6">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isDarkMode ? 'bg-white/10' : 'bg-white/50'
            }`}>
              <Headphones className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentEpisode.title}</h2>
            <p className={`mb-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              by {currentEpisode.instructor}
            </p>
            <span className={`px-3 py-1 rounded-full text-sm ${
              isDarkMode ? 'bg-white/20' : 'bg-white/60'
            }`}>
              {currentEpisode.category}
            </span>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-center space-x-8 mb-6">
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors">
              <SkipBack className="w-8 h-8" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-4 rounded-full transition-colors ${
                isDarkMode ? 'bg-white text-purple-900 hover:bg-gray-100' : 'bg-purple-900 text-white hover:bg-purple-800'
              }`}
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
            </button>
            
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors">
              <SkipForward className="w-8 h-8" />
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-white/40'}`}>
              <div className={`h-2 rounded-full w-1/3 ${
                isDarkMode ? 'bg-white' : 'bg-purple-900'
              }`} />
            </div>
            <div className={`flex justify-between text-sm ${
              isDarkMode ? 'text-purple-200' : 'text-purple-800'
            }`}>
              <span>15:20</span>
              <span>{currentEpisode.duration}</span>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">📚 Available Episodes</h3>
          {episodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => setCurrentEpisode(episode)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } ${currentEpisode.id === episode.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{episode.title}</h4>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {episode.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>
                      {episode.instructor}
                    </span>
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                      {episode.duration}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {episode.category}
                    </span>
                  </div>
                </div>
                
                <button className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className={`mt-8 p-6 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-bold mb-4">🎯 Podcast Learning Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Background learning while multitasking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Variable playback speed (0.5x - 2x)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Offline download for commuting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Auto-resume from last position</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}