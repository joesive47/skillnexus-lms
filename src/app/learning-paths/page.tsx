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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <MapPin className="w-8 h-8 mr-3" />
            Learning Paths
          </h1>
          <p className="text-gray-300">Your personalized journey to career success</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              My Paths
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-purple-600 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="data-[state=active]:bg-purple-600 flex items-center">
              <Wand2 className="w-4 h-4 mr-2" />
              AI Generator
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