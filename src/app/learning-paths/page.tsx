'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LearningPathDashboard from '@/components/learning-path/LearningPathDashboard'
import PathDiscovery from '@/components/learning-path/PathDiscovery'
import ProgressDashboard from '@/components/learning-path/ProgressDashboard'
import AIPathGenerator from '@/components/learning-path/AIPathGenerator'
import { MapPin, Search, BarChart3, Wand2 } from 'lucide-react'

export default function LearningPathsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 sm:text-4xl sm:mb-2">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            Learning Paths
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mt-1">Your personalized journey to career success</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-gray-800 border-gray-700 flex w-full overflow-x-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 flex items-center gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden xs:inline sm:inline">My Paths</span>
              <span className="xs:hidden sm:hidden">Paths</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-purple-600 flex items-center gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600 flex items-center gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="data-[state=active]:bg-purple-600 flex items-center gap-1.5 text-xs sm:text-sm flex-1 sm:flex-none">
              <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">AI Generator</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <LearningPathDashboard />
          </TabsContent>

          <TabsContent value="discover">
            <PathDiscovery />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="ai-generator">
            <AIPathGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}