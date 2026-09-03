'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Maximize, Pause, Play, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
import {
  VIDEO_HEARTBEAT_SECONDS,
  type VideoPresenceViolation,
  type VideoProgressEvidence,
} from '@/lib/video-presence'

type YouTubePlayerInstance = {
  getCurrentTime: () => number
  getDuration: () => number
  getPlaybackRate: () => number
  setPlaybackRate: (rate: number) => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  destroy: () => void
}

type YouTubeApi = {
  Player: new (elementId: string, options: Record<string, unknown>) => YouTubePlayerInstance
  PlayerState: { PLAYING: number; ENDED: number }
}

const youtubeWindow = () => window as unknown as Window & {
  YT?: YouTubeApi
  onYouTubeIframeAPIReady?: () => void
}

type SecureVideoPlayerProps = {
  youtubeId: string
  initialWatchedTime?: number
  initialCompleted?: boolean
  requiredWatchPercentage?: number
  onHeartbeat: (watchedTime: number, totalTime: number, evidence: VideoProgressEvidence) => Promise<boolean>
}

let youtubeApiPromise: Promise<void> | null = null

function loadYouTubeApi() {
  if (youtubeWindow().YT?.Player) return Promise.resolve()
  if (youtubeApiPromise) return youtubeApiPromise
  youtubeApiPromise = new Promise<void>((resolve) => {
    const previousReady = youtubeWindow().onYouTubeIframeAPIReady
    youtubeWindow().onYouTubeIframeAPIReady = () => {
      previousReady?.()
      resolve()
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }
  })
  return youtubeApiPromise
}

export function SecureVideoPlayer({
  youtubeId,
  initialWatchedTime = 0,
  initialCompleted = false,
  requiredWatchPercentage = 80,
  onHeartbeat,
}: SecureVideoPlayerProps) {
  const reactId = useId()
  const containerId = `secure-video-${reactId.replace(/:/g, '')}`
  const playerRef = useRef<YouTubePlayerInstance | null>(null)
  const heartbeatRef = useRef(onHeartbeat)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionIdRef = useRef('')
  const sequenceRef = useRef(0)
  const activeSecondsRef = useRef(0)
  const lastTickRef = useRef(Date.now())
  const lastPlayerTimeRef = useRef(initialWatchedTime)
  const maxWatchedTimeRef = useRef(initialWatchedTime)
  const playingRef = useRef(false)
  const completedRef = useRef(initialCompleted)
  const awayRef = useRef(false)
  const savingRef = useRef(false)
  const lastCompletionAttemptRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialWatchedTime)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [presencePrompt, setPresencePrompt] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  heartbeatRef.current = onHeartbeat

  useEffect(() => {
    sessionIdRef.current = window.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`
    let disposed = false

    const sendHeartbeat = async (violation?: VideoPresenceViolation) => {
      const player = playerRef.current
      if (!player?.getCurrentTime || !player?.getDuration || savingRef.current) return false
      const watchedTime = Number(player.getCurrentTime())
      const videoDuration = Number(player.getDuration())
      if (!Number.isFinite(watchedTime) || !Number.isFinite(videoDuration) || videoDuration <= 0) return false
      const evidence: VideoProgressEvidence = {
        sessionId: sessionIdRef.current,
        sequence: ++sequenceRef.current,
        activeSeconds: Math.min(20, Math.max(0, activeSecondsRef.current)),
        visibility: document.visibilityState === 'visible' ? 'visible' : 'hidden',
        playbackRate: Number(player.getPlaybackRate?.() || 1),
        ...(violation ? { violation } : {}),
      }
      activeSecondsRef.current = 0
      savingRef.current = true
      try {
        const completed = await heartbeatRef.current(watchedTime, videoDuration, evidence)
        if (completed) {
          completedRef.current = true
          setIsCompleted(true)
        }
        return completed
      } finally {
        savingRef.current = false
      }
    }

    const enterAwayMode = (violation: VideoPresenceViolation, message: string) => {
      if (awayRef.current) return
      awayRef.current = true
      playingRef.current = false
      setIsPlaying(false)
      setPresencePrompt(message)
      playerRef.current?.pauseVideo?.()
      void sendHeartbeat(violation)
    }

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') enterAwayMode('PAGE_HIDDEN', 'ระบบหยุดนับเวลา เพราะออกจากหน้าบทเรียน')
    }
    const handleBlur = () => enterAwayMode('WINDOW_BLURRED', 'ระบบหยุดนับเวลา เพราะหน้าต่างไม่ได้ถูกใช้งาน')

    const startTracking = () => {
      intervalRef.current = setInterval(() => {
        const player = playerRef.current
        if (!player?.getCurrentTime || !player?.getDuration) return
        const now = Date.now()
        const elapsed = Math.min(1.5, Math.max(0, (now - lastTickRef.current) / 1000))
        lastTickRef.current = now
        const watchedTime = Number(player.getCurrentTime())
        const videoDuration = Number(player.getDuration())
        if (!Number.isFinite(watchedTime) || !Number.isFinite(videoDuration) || videoDuration <= 0) return

        const playbackRate = Number(player.getPlaybackRate?.() || 1)
        if (playbackRate !== 1) {
          player.setPlaybackRate?.(1)
          setWarning('ระบบอนุญาตความเร็ว 1x เท่านั้น')
          window.setTimeout(() => setWarning(null), 3000)
          enterAwayMode('PLAYBACK_RATE_CHANGED', 'ตรวจพบการเปลี่ยนความเร็ว กรุณายืนยันเพื่อเรียนต่อที่ 1x')
          return
        }

        const movedForward = watchedTime - lastPlayerTimeRef.current
        if (watchedTime > maxWatchedTimeRef.current + 3 && movedForward > elapsed + 2.5) {
          player.seekTo(maxWatchedTimeRef.current, true)
          setWarning('ไม่สามารถข้ามไปยังช่วงที่ยังไม่ได้เรียนได้')
          window.setTimeout(() => setWarning(null), 3000)
          void sendHeartbeat('FORWARD_SEEK_BLOCKED')
          return
        }

        lastPlayerTimeRef.current = watchedTime
        maxWatchedTimeRef.current = Math.max(maxWatchedTimeRef.current, watchedTime)
        setCurrentTime(watchedTime)
        setDuration(videoDuration)

        if (playingRef.current && !awayRef.current && document.visibilityState === 'visible' && document.hasFocus()) {
          activeSecondsRef.current += elapsed
        }
        if (activeSecondsRef.current >= VIDEO_HEARTBEAT_SECONDS) void sendHeartbeat()

        const reachedThreshold = watchedTime >= videoDuration * requiredWatchPercentage / 100
        if (!completedRef.current && reachedThreshold && now - lastCompletionAttemptRef.current > 10_000) {
          lastCompletionAttemptRef.current = now
          void sendHeartbeat()
        }
      }, 1000)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleBlur)

    void loadYouTubeApi().then(() => {
      if (disposed) return
      const youtube = youtubeWindow().YT
      if (!youtube) return
      playerRef.current = new youtube.Player(containerId, {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          enablejsapi: 1,
          playsinline: 1,
          start: Math.floor(initialWatchedTime),
        },
        events: {
          onReady: () => {
            playerRef.current?.setPlaybackRate?.(1)
            setDuration(Number(playerRef.current?.getDuration?.() || 0))
            void sendHeartbeat()
            startTracking()
          },
          onStateChange: (event: { data: number }) => {
            const playing = event.data === youtube.PlayerState.PLAYING
            if (playing && awayRef.current) {
              playerRef.current?.pauseVideo?.()
              return
            }
            playingRef.current = playing
            setIsPlaying(playing)
            lastTickRef.current = Date.now()
            if (event.data === youtube.PlayerState.ENDED) void sendHeartbeat()
          },
          onPlaybackRateChange: (event: { data: number }) => {
            if (event.data !== 1) {
              playerRef.current?.setPlaybackRate?.(1)
              enterAwayMode('PLAYBACK_RATE_CHANGED', 'ตรวจพบการเปลี่ยนความเร็ว กรุณายืนยันเพื่อเรียนต่อที่ 1x')
            }
          },
          onError: () => setError('ไม่สามารถโหลดวิดีโอได้'),
        },
      })
    })

    return () => {
      disposed = true
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleBlur)
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
  }, [containerId, initialWatchedTime, requiredWatchPercentage, youtubeId])

  const resumeLearning = () => {
    awayRef.current = false
    lastTickRef.current = Date.now()
    lastPlayerTimeRef.current = Number(playerRef.current?.getCurrentTime?.() || currentTime)
    playerRef.current?.setPlaybackRate?.(1)
    setPresencePrompt(null)
    setWarning(null)
    playerRef.current?.playVideo?.()
  }

  const togglePlay = () => {
    if (presencePrompt) return
    if (isPlaying) playerRef.current?.pauseVideo?.()
    else playerRef.current?.playVideo?.()
  }

  const toggleMute = () => {
    if (isMuted) playerRef.current?.unMute?.()
    else playerRef.current?.mute?.()
    setIsMuted(!isMuted)
  }

  const progress = duration > 0 ? Math.min(100, currentTime / duration * 100) : 0
  const formatTime = (seconds: number) => `${Math.floor(Math.max(0, seconds) / 60)}:${Math.floor(Math.max(0, seconds) % 60).toString().padStart(2, '0')}`

  if (error) return <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-950 text-white">{error}</div>

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
      <div id={containerId} className="h-full w-full" />

      <div className="pointer-events-none absolute left-4 right-4 top-4 rounded-lg bg-black/75 p-3 text-white">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span>{formatTime(currentTime)} / {formatTime(duration)}</span><span className="flex items-center gap-1 text-xs"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Secure learning · 1x · ต้องดู {requiredWatchPercentage}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-600"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>
      </div>

      {warning && !presencePrompt && <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-white"><AlertTriangle className="h-5 w-5" />{warning}</div>}

      {presencePrompt && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 p-6 text-white">
          <div className="max-w-md text-center"><AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-400" /><h3 className="text-xl font-semibold">หยุดนับเวลาเรียนชั่วคราว</h3><p className="mt-2 text-sm text-slate-300">{presencePrompt}</p><button type="button" onClick={resumeLearning} className="mt-5 rounded-md bg-emerald-600 px-5 py-2.5 font-medium hover:bg-emerald-700">กลับมาเรียนต่อ</button></div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex gap-2"><button type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause video' : 'Play video'} className="rounded-full bg-black/75 p-3 text-white">{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button><button type="button" onClick={toggleMute} aria-label={isMuted ? 'Unmute video' : 'Mute video'} className="rounded-full bg-black/75 p-3 text-white">{isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button></div>
        <div className="flex items-center gap-2">{isCompleted && <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-sm text-white"><CheckCircle2 className="h-4 w-4" /> Server verified</span>}<button type="button" onClick={() => document.getElementById(containerId)?.parentElement?.requestFullscreen?.()} aria-label="Fullscreen" className="rounded-full bg-black/75 p-3 text-white"><Maximize className="h-5 w-5" /></button></div>
      </div>
    </div>
  )
}
