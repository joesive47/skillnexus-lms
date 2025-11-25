'use client'

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share, BookOpen, Trophy, Star } from 'lucide-react'
import VerticalVideoPlayer from '../video/VerticalVideoPlayer'

interface Course {
  id: string
  title: string
  videoUrl: string
  duration: number
  instructor: string
  likes: number
  comments: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  progress?: number
}

interface MobileLearningInterfaceProps {
  courses: Course[]
  currentIndex?: number
}

export default function MobileLearningInterface({ 
  courses, 
  currentIndex = 0 
}: MobileLearningInterfaceProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [isLiked, setIsLiked] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [progress, setProgress] = useState(0)

  const currentCourse = courses[activeIndex]

  const handleSwipeUp = () => {
    if (activeIndex < courses.length - 1) {
      setActiveIndex(activeIndex + 1)
      setProgress(0)
      setIsLiked(false)
    }
  }

  const handleSwipeDown = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
      setProgress(0)
      setIsLiked(false)
    }
  }

  const handleProgress = (newProgress: number) => {
    setProgress(newProgress)
  }

  // Touch handlers for swipe gestures
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe) {
      handleSwipeUp()
    }
    if (isDownSwipe) {
      handleSwipeDown()
    }
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Player */}
      <VerticalVideoPlayer
        src={currentCourse.videoUrl}
        title={currentCourse.title}
        duration={currentCourse.duration}
        onProgress={handleProgress}
        antiSkip={true}
      />

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 text-white">
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center space-y-1"
        >
          <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50'}`}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} />
          </div>
          <span className="text-xs">{currentCourse.likes + (isLiked ? 1 : 0)}</span>
        </button>

        {/* Comments */}
        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-black/50">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs">{currentCourse.comments}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center space-y-1">
          <div className="p-3 rounded-full bg-black/50">
            <Share className="w-6 h-6" />
          </div>
          <span className="text-xs">Share</span>
        </button>

        {/* Course Info */}
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="flex flex-col items-center space-y-1"
        >
          <div className="p-3 rounded-full bg-black/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xs">Info</span>
        </button>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2">
        {activeIndex > 0 && (
          <button onClick={handleSwipeDown} className="text-white/70">
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex flex-col space-y-1">
          {courses.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full ${
                index === activeIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {activeIndex < courses.length - 1 && (
          <button onClick={handleSwipeUp} className="text-white/70">
            <ChevronDown className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Course Info Overlay */}
      {showInfo && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 text-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{currentCourse.title}</h2>
              <button onClick={() => setShowInfo(false)} className="text-white/70">
                ✕
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{currentCourse.instructor}</span>
              </span>
              <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
                {currentCourse.difficulty}
              </span>
              <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
                {currentCourse.category}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {progress >= 100 && (
              <div className="flex items-center justify-center space-x-2 bg-green-500 rounded-lg p-3">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Course Completed! 🎉</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Swipe Hints */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/50 text-xs">
        <div className="flex flex-col items-center space-y-2">
          <ChevronUp className="w-4 h-4 animate-bounce" />
          <span>Swipe</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </div>
  )
}