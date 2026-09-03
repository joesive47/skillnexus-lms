'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Trophy, BookOpen, Users, Clock } from 'lucide-react'

interface SocialPost {
  id: string
  user: {
    name: string
    avatar: string
    title: string
  }
  type: 'achievement' | 'progress' | 'discussion' | 'completion'
  content: string
  course?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

const socialPosts: SocialPost[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://via.placeholder.com/40x40/3b82f6/ffffff?text=SC',
      title: 'Frontend Developer'
    },
    type: 'achievement',
    content: 'Just earned the React Master certificate! 🎉',
    course: 'React 18 Complete Guide',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: '2',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/40x40/10b981/ffffff?text=MJ',
      title: 'Full Stack Developer'
    },
    type: 'progress',
    content: 'Halfway through the Node.js course. The async/await section was mind-blowing! 🤯',
    course: 'Node.js Backend Development',
    timestamp: '4 hours ago',
    likes: 15,
    comments: 3,
    isLiked: true
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://via.placeholder.com/40x40/f59e0b/ffffff?text=EW',
      title: 'UX Designer'
    },
    type: 'completion',
    content: 'Completed my 10th course this month! Learning streak is strong 💪',
    timestamp: '1 day ago',
    likes: 42,
    comments: 12,
    isLiked: false
  }
]

export default function SocialFeed() {
  const [posts, setPosts] = useState(socialPosts)
  const [newPost, setNewPost] = useState('')

  const toggleLike = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  const addPost = () => {
    if (!newPost.trim()) return

    const post: SocialPost = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=Y',
        title: 'Learner'
      },
      type: 'discussion',
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'progress': return <BookOpen className="w-5 h-5 text-blue-500" />
      case 'completion': return <Trophy className="w-5 h-5 text-green-500" />
      default: return <MessageCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">👥 Learning Community</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>1,247 active learners</span>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your learning progress or ask a question..."
          className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={addPost}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Share
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-4">
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{post.user.name}</h3>
                  {getPostIcon(post.type)}
                </div>
                <p className="text-sm text-gray-400">{post.user.title}</p>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{post.timestamp}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-3">
              <p className="text-gray-200 mb-2">{post.content}</p>
              {post.course && (
                <div className="inline-block bg-blue-900/50 border border-blue-500/30 rounded-lg px-3 py-1 text-sm">
                  📚 {post.course}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-6 pt-3 border-t border-gray-700">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Study Groups */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
        <h3 className="text-lg font-bold mb-3">🎓 Study Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h4 className="font-semibold">React Developers</h4>
            <p className="text-sm text-gray-400">156 members • 12 active now</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h4 className="font-semibold">AI/ML Enthusiasts</h4>
            <p className="text-sm text-gray-400">89 members • 8 active now</p>
          </div>
        </div>
      </div>
    </div>
  )
}