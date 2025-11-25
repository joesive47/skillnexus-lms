'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  BookOpen, 
  Trophy,
  UserPlus,
  Calendar,
  Video,
  Send
} from 'lucide-react'

interface StudyGroup {
  id: string
  name: string
  members: number
  topic: string
  nextSession: Date
  isJoined: boolean
}

interface ForumPost {
  id: string
  author: string
  title: string
  content: string
  likes: number
  replies: number
  timestamp: Date
  tags: string[]
}

export default function SocialLearning() {
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'JavaScript Study Group',
      members: 45,
      topic: 'Advanced ES6 Features',
      nextSession: new Date('2024-02-15T19:00:00'),
      isJoined: true
    },
    {
      id: '2',
      name: 'React Developers',
      members: 78,
      topic: 'Hooks Deep Dive',
      nextSession: new Date('2024-02-16T20:00:00'),
      isJoined: false
    },
    {
      id: '3',
      name: 'Data Science Club',
      members: 32,
      topic: 'Machine Learning Basics',
      nextSession: new Date('2024-02-17T18:30:00'),
      isJoined: true
    }
  ])

  const [forumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      author: 'นายสมชาย ใจดี',
      title: 'วิธีการใช้ async/await ให้มีประสิทธิภาพ',
      content: 'ผมอยากแชร์เทคนิคการใช้ async/await ที่ช่วยให้โค้ดอ่านง่ายขึ้น...',
      likes: 24,
      replies: 8,
      timestamp: new Date('2024-01-20T10:30:00'),
      tags: ['JavaScript', 'Async', 'Best Practices']
    },
    {
      id: '2',
      author: 'นางสาวมาลี สวยงาม',
      title: 'React Performance Optimization Tips',
      content: 'เทคนิคการเพิ่มประสิทธิภาพ React App ที่ทุกคนควรรู้...',
      likes: 31,
      replies: 12,
      timestamp: new Date('2024-01-19T14:15:00'),
      tags: ['React', 'Performance', 'Optimization']
    }
  ])

  const [newPost, setNewPost] = useState('')

  const joinGroup = (groupId: string) => {
    console.log('Joining group:', groupId)
  }

  const likePost = (postId: string) => {
    console.log('Liking post:', postId)
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-purple-400" />
            Social Learning Hub
          </h1>
          <p className="text-gray-400 mt-1">เรียนรู้ร่วมกันและแบ่งปันความรู้</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <UserPlus className="w-4 h-4 mr-2" />
          สร้างกลุ่มใหม่
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Forum Posts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                Community Forum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Post */}
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    คุณ
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="แบ่งปันความรู้หรือถามคำถาม..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white mb-3"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-600">
                          #JavaScript
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-600">
                          #React
                        </Badge>
                      </div>
                      <Button size="sm" className="bg-blue-600">
                        <Send className="w-4 h-4 mr-1" />
                        โพสต์
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forum Posts */}
              {forumPosts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium">{post.author}</span>
                        <span className="text-gray-400 text-sm">
                          {post.timestamp.toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => likePost(post.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.replies}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400">
                          <Share2 className="w-4 h-4 mr-1" />
                          แชร์
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Study Groups */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group) => (
                <div key={group.id} className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{group.name}</h3>
                    <Badge className={group.isJoined ? 'bg-green-600' : 'bg-gray-600'}>
                      {group.isJoined ? 'Joined' : 'Join'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{group.topic}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {group.members} members
                    </span>
                    <span className="text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {group.nextSession.toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  {!group.isJoined && (
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-purple-600"
                      onClick={() => joinGroup(group.id)}
                    >
                      เข้าร่วมกลุ่ม
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Live Coding Session</h4>
                    <p className="text-gray-400 text-sm">วันนี้ 19:00</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Book Club Meeting</h4>
                    <p className="text-gray-400 text-sm">พรุ่งนี้ 20:00</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Coding Challenge</h4>
                    <p className="text-gray-400 text-sm">สุดสัปดาห์นี้</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-orange-400" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'นายสมชาย ใจดี', points: 1250, rank: 1 },
                { name: 'นางสาวมาลี สวยงาม', points: 980, rank: 2 },
                { name: 'นายวิชัย เก่งมาก', points: 875, rank: 3 }
              ].map((user) => (
                <div key={user.rank} className="flex items-center space-x-3 p-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-black' :
                    user.rank === 2 ? 'bg-gray-400 text-black' :
                    'bg-orange-600 text-white'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.points} points</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}