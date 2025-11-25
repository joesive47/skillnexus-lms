import AudioPlayer from '@/components/audio/AudioPlayer'
import PodcastMode from '@/components/audio/PodcastMode'
import OfflineSync from '@/components/offline/OfflineSync'
import SocialFeed from '@/components/social/SocialFeed'

export default function Phase2Page() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🚀 SkillNexus Phase 2</h1>
          <p className="text-xl text-gray-300">Audio Learning • Offline Sync • Social Features</p>
        </div>

        {/* Audio Learning Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">🎵 Audio Learning</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AudioPlayer
              src="/audio/sample.mp3"
              title="JavaScript Fundamentals"
              instructor="Sarah Chen"
              duration={2700}
              antiSkip={true}
            />
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎧 Podcast Mode</h3>
              <p className="text-gray-300 mb-4">
                Learn while commuting, exercising, or doing other activities. 
                Perfect for busy professionals who want to maximize their learning time.
              </p>
              <a 
                href="/podcast-mode" 
                className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Podcast Mode
              </a>
            </div>
          </div>
        </section>

        {/* Offline Sync Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">🔄 Offline Learning</h2>
          <OfflineSync />
        </section>

        {/* Social Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">👥 Social Learning</h2>
          <SocialFeed />
        </section>

        {/* Features Overview */}
        <section className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">✨ Phase 2 Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Audio Learning</h3>
              <p className="text-gray-300">Learn through high-quality audio content with anti-skip protection</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-2">Offline Sync</h3>
              <p className="text-gray-300">Download content and sync progress across all devices</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Social Features</h3>
              <p className="text-gray-300">Connect with learners, share progress, and join study groups</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'SkillNexus Phase 2 - Audio Learning & Social Features',
  description: 'Experience the next generation of learning with audio content, offline sync, and social features',
}