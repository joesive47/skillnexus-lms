'use client'

import { useState } from 'react'
import { Plus, Trash2, FileText, Video, Image, CheckSquare, Download, Eye } from 'lucide-react'

interface Slide {
  id: string
  type: 'text' | 'video' | 'image' | 'quiz'
  title: string
  content: string
  media?: string
  quiz?: {
    question: string
    options: string[]
    correct: number
  }
}

export default function ScormBuilder() {
  const [courseName, setCourseName] = useState('My SCORM Course')
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', type: 'text', title: 'Welcome', content: 'Welcome to this course!' }
  ])
  const [activeSlide, setActiveSlide] = useState(0)
  const [preview, setPreview] = useState(false)

  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      title: `New ${type} slide`,
      content: type === 'text' ? 'Enter your content here...' : '',
      quiz: type === 'quiz' ? {
        question: 'Your question?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: 0
      } : undefined
    }
    setSlides([...slides, newSlide])
    setActiveSlide(slides.length)
  }

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], ...updates }
    setSlides(newSlides)
  }

  const deleteSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index))
    if (activeSlide >= slides.length - 1) setActiveSlide(Math.max(0, slides.length - 2))
  }

  const generateScorm = () => {
    const scormData = {
      metadata: {
        title: courseName,
        version: '1.2',
        created: new Date().toISOString()
      },
      slides: slides.map(slide => ({
        type: slide.type,
        title: slide.title,
        content: slide.content,
        media: slide.media,
        quiz: slide.quiz
      }))
    }

    const blob = new Blob([JSON.stringify(scormData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${courseName.replace(/\s+/g, '_')}_scorm.json`
    a.click()
  }

  const currentSlide = slides[activeSlide]

  if (preview) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setPreview(false)}
            className="mb-4 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            ← Back to Editor
          </button>
          
          <div className="bg-gray-900 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-6">{courseName}</h1>
            
            {slides.map((slide, i) => (
              <div key={slide.id} className="mb-8 pb-8 border-b border-gray-700 last:border-0">
                <h2 className="text-2xl font-bold mb-4">{i + 1}. {slide.title}</h2>
                
                {slide.type === 'text' && (
                  <p className="text-gray-300 whitespace-pre-wrap">{slide.content}</p>
                )}
                
                {slide.type === 'video' && (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-400">Video: {slide.media || 'No video URL'}</p>
                  </div>
                )}
                
                {slide.type === 'image' && (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <Image className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-gray-400">Image: {slide.media || 'No image URL'}</p>
                  </div>
                )}
                
                {slide.type === 'quiz' && slide.quiz && (
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
                    <p className="text-lg mb-4">{slide.quiz.question}</p>
                    <div className="space-y-2">
                      {slide.quiz.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`p-3 rounded-lg ${
                            j === slide.quiz!.correct ? 'bg-green-900/50 border border-green-500' : 'bg-gray-800'
                          }`}
                        >
                          {opt} {j === slide.quiz!.correct && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">📦 SCORM Builder</h1>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="bg-gray-800 rounded px-3 py-1 text-lg"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPreview(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              <Eye className="w-5 h-5" />
              <span>Preview</span>
            </button>
            <button
              onClick={generateScorm}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              <Download className="w-5 h-5" />
              <span>Export SCORM</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Slide List */}
          <div className="col-span-3 bg-gray-900 rounded-xl p-4">
            <h2 className="font-bold mb-4">Slides ({slides.length})</h2>
            
            <div className="space-y-2 mb-4">
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlide(i)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    activeSlide === i ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {slide.type === 'text' && <FileText className="w-4 h-4" />}
                      {slide.type === 'video' && <Video className="w-4 h-4" />}
                      {slide.type === 'image' && <Image className="w-4 h-4" />}
                      {slide.type === 'quiz' && <CheckSquare className="w-4 h-4" />}
                      <span className="text-sm">{i + 1}. {slide.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSlide(i)
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => addSlide('text')}
                className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Text Slide</span>
              </button>
              <button
                onClick={() => addSlide('video')}
                className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Video Slide</span>
              </button>
              <button
                onClick={() => addSlide('image')}
                className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Image Slide</span>
              </button>
              <button
                onClick={() => addSlide('quiz')}
                className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Quiz Slide</span>
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-9 bg-gray-900 rounded-xl p-6">
            {currentSlide && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Slide Title</label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateSlide(activeSlide, { title: e.target.value })}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2"
                  />
                </div>

                {currentSlide.type === 'text' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Content</label>
                    <textarea
                      value={currentSlide.content}
                      onChange={(e) => updateSlide(activeSlide, { content: e.target.value })}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 h-64 resize-none"
                    />
                  </div>
                )}

                {currentSlide.type === 'video' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Video URL</label>
                    <input
                      type="text"
                      value={currentSlide.media || ''}
                      onChange={(e) => updateSlide(activeSlide, { media: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4"
                    />
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={currentSlide.content}
                      onChange={(e) => updateSlide(activeSlide, { content: e.target.value })}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 h-32 resize-none"
                    />
                  </div>
                )}

                {currentSlide.type === 'image' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Image URL</label>
                    <input
                      type="text"
                      value={currentSlide.media || ''}
                      onChange={(e) => updateSlide(activeSlide, { media: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4"
                    />
                    <label className="block text-sm font-semibold mb-2">Caption</label>
                    <textarea
                      value={currentSlide.content}
                      onChange={(e) => updateSlide(activeSlide, { content: e.target.value })}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 h-32 resize-none"
                    />
                  </div>
                )}

                {currentSlide.type === 'quiz' && currentSlide.quiz && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Question</label>
                      <input
                        type="text"
                        value={currentSlide.quiz.question}
                        onChange={(e) => updateSlide(activeSlide, {
                          quiz: { ...currentSlide.quiz!, question: e.target.value }
                        })}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2"
                      />
                    </div>

                    {currentSlide.quiz.options.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={currentSlide.quiz!.correct === i}
                          onChange={() => updateSlide(activeSlide, {
                            quiz: { ...currentSlide.quiz!, correct: i }
                          })}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...currentSlide.quiz!.options]
                            newOptions[i] = e.target.value
                            updateSlide(activeSlide, {
                              quiz: { ...currentSlide.quiz!, options: newOptions }
                            })
                          }}
                          className="flex-1 bg-gray-800 rounded-lg px-4 py-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}