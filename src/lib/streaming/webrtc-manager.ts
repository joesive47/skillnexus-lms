interface StreamConfig {
  video: boolean
  audio: boolean
  screen?: boolean
}

export class WebRTCManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]

  async startLocalStream(config: StreamConfig): Promise<MediaStream> {
    if (config.screen) {
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: config.audio
      })
    } else {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: config.video,
        audio: config.audio
      })
    }
    return this.localStream
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }
  }

  async createPeerConnection(
    peerId: string,
    onTrack: (stream: MediaStream) => void,
    onIceCandidate: (candidate: RTCIceCandidate) => void
  ): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers })

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!)
      })
    }

    pc.ontrack = (event) => onTrack(event.streams[0])
    pc.onicecandidate = (event) => {
      if (event.candidate) onIceCandidate(event.candidate)
    }

    this.peerConnections.set(peerId, pc)
    return pc
  }

  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnections.get(peerId)
    if (!pc) throw new Error('Peer not found')
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    return offer
  }

  async createAnswer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnections.get(peerId)
    if (!pc) throw new Error('Peer not found')
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return answer
  }

  async setRemoteDescription(peerId: string, description: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(peerId)
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(description))
  }

  async addIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(peerId)
    if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate))
  }

  closePeerConnection(peerId: string) {
    const pc = this.peerConnections.get(peerId)
    if (pc) {
      pc.close()
      this.peerConnections.delete(peerId)
    }
  }

  closeAllConnections() {
    this.peerConnections.forEach(pc => pc.close())
    this.peerConnections.clear()
    this.stopLocalStream()
  }
}
