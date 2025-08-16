// Multi-Scene Video Workflow Types

export interface VideoScene {
  id: string
  order: number
  script: string
  avatarId: string
  voiceId: string
  duration: number
  startTime: number
  endTime: number
  status: 'pending' | 'generating' | 'completed' | 'failed'
  aiVideoJobId?: string
  videoUrl?: string
  thumbnailUrl?: string
  metadata?: {
    avatarName: string
    voiceName: string
    accent: string
    tone: string
  }
}

export interface VideoProject {
  id: string
  name: string
  description: string
  campaignId: string
  scenes: VideoScene[]
  totalDuration: number
  status: 'draft' | 'generating' | 'editing' | 'rendering' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  settings: {
    aspectRatio: '9:16' | '16:9' | '1:1' | '4:5'
    quality: 'standard' | 'high' | 'premium'
    fps: 24 | 30 | 60
    resolution: '720p' | '1080p' | '4K'
  }
}

export interface BrandCustomization {
  logo: {
    enabled: boolean
    url: string
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    size: 'small' | 'medium' | 'large'
    animation: 'none' | 'fade-in' | 'slide-in' | 'bounce'
  }
  captions: {
    enabled: boolean
    font: string
    fontSize: number
    color: string
    backgroundColor: string
    position: 'top' | 'bottom' | 'overlay'
    animation: 'none' | 'typewriter' | 'fade-in' | 'slide-up'
  }
  music: {
    enabled: boolean
    trackUrl: string
    volume: number
    fadeIn: number
    fadeOut: number
  }
  transitions: {
    enabled: boolean
    type: 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe'
    duration: number
  }
  overlays: {
    enabled: boolean
    elements: Array<{
      id: string
      type: 'text' | 'image' | 'shape' | 'cta'
      content: string
      position: { x: number; y: number }
      size: { width: number; height: number }
      animation: string
      timing: { start: number; end: number }
    }>
  }
}

export interface TimelineTrack {
  id: string
  type: 'video' | 'audio' | 'overlay' | 'caption'
  name: string
  clips: TimelineClip[]
  locked: boolean
  visible: boolean
}

export interface TimelineClip {
  id: string
  trackId: string
  type: 'video' | 'audio' | 'overlay' | 'caption'
  content: VideoScene | string | any
  startTime: number
  duration: number
  position: { x: number; y: number }
  selected: boolean
  trimmed: {
    start: number
    end: number
  }
}

export interface PublishingTarget {
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'linkedin'
  accountId: string
  accountName: string
  autoPublish: boolean
  scheduledTime?: string
  targeting?: {
    audience: string
    location: string[]
    interests: string[]
    ageRange: [number, number]
    gender: 'all' | 'male' | 'female'
  }
  adCampaign?: {
    id: string
    name: string
    budget: number
    objective: 'awareness' | 'traffic' | 'conversions' | 'engagement'
  }
}

export interface RenderSettings {
  format: 'mp4' | 'mov' | 'avi'
  codec: 'h264' | 'h265' | 'prores'
  bitrate: 'low' | 'medium' | 'high' | 'custom'
  customBitrate?: number
  audioCodec: 'aac' | 'mp3' | 'wav'
  audioBitrate: number
  includeWatermark: boolean
  watermarkText?: string
}

export interface VideoAnalytics {
  views: number
  engagement: number
  shares: number
  comments: number
  likes: number
  clickThroughRate: number
  conversionRate: number
  costPerView: number
  costPerClick: number
  platformBreakdown: Record<string, {
    views: number
    engagement: number
    cost: number
  }>
}
