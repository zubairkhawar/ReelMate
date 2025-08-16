// AI Video Service for avatars and voices
const AI_VIDEO_API_BASE = process.env.NEXT_PUBLIC_AI_VIDEO_API_URL || 'https://api.heygen.com/v1'

interface AIVideoAvatar {
  id: string
  name: string
  gender: string
  ethnicity: string
  style: string
  thumbnail_url: string
  preview_url?: string
  is_active: boolean
  metadata?: {
    age?: number
    profession?: string
    personality?: string
  }
}

interface AIVideoVoice {
  id: string
  name: string
  gender: string
  accent: string
  language: string
  tone: string
  is_active: boolean
  sample_url?: string
  metadata?: {
    age?: number
    emotion?: string
    speed?: string
  }
}

class AIVideoService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_AI_VIDEO_API_KEY || ''
  }

  // Fetch all available avatars from AI Video service
  async getAvatars(): Promise<AIVideoAvatar[]> {
    try {
      console.log('🔍 Fetching AI video avatars...')
      console.log('🔑 API Key available:', !!this.apiKey)
      console.log('🌐 API URL:', AI_VIDEO_API_BASE)
      
      if (!this.apiKey) {
        console.log('⚠️ No API key found')
        return []
      }

      const response = await fetch(`${AI_VIDEO_API_BASE}/avatar/list`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch avatars: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ AI video avatars fetched successfully:', data.data?.avatars?.length || 0)
      return data.data?.avatars || []
    } catch (error) {
      console.error('❌ Error fetching AI video avatars:', error)
      return []
    }
  }

  // Fetch all available voices from AI Video service
  async getVoices(): Promise<AIVideoVoice[]> {
    try {
      console.log('🔍 Fetching AI video voices...')
      console.log('🔑 API Key available:', !!this.apiKey)
      
      if (!this.apiKey) {
        console.log('⚠️ No API key found')
        return []
      }

      const response = await fetch(`${AI_VIDEO_API_BASE}/voice/list`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ AI video voices fetched successfully:', data.data?.voices?.length || 0)
      return data.data?.voices || []
    } catch (error) {
      console.error('❌ Error fetching AI video voices:', error)
      return []
    }
  }

  // Play voice sample
  async playVoiceSample(voiceId: string): Promise<void> {
    try {
      const voices = await this.getVoices()
      const voice = voices.find(v => v.id === voiceId)
      
      if (voice?.sample_url) {
        const audio = new Audio(voice.sample_url)
        await audio.play()
      } else {
        console.warn('No sample URL available for this voice')
      }
    } catch (error) {
      console.error('Error playing voice sample:', error)
    }
  }

  // Generate video with AI Video service
  async generateVideo(params: {
    script: string
    avatarId: string
    voiceId: string
    settings: {
      duration: number
      quality: string
      style: string
    }
  }): Promise<{ jobId: string; status: string }> {
    try {
      console.log('🎬 Starting video generation with params:', params)
      
      const response = await fetch(`${AI_VIDEO_API_BASE}/video/generate`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: params.avatarId,
                input_text: params.script
              },
              voice: {
                type: 'text',
                input_text: params.script,
                voice_id: params.voiceId
              }
            }
          ],
          test: false,
          aspect_ratio: '9:16', // Default to vertical format
          quality: params.settings.quality,
          background: 'auto'
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to generate video: ${response.statusText} - ${errorData}`)
      }

      const data = await response.json()
      console.log('✅ Video generation started successfully:', data.data?.video_id)
      
      return {
        jobId: data.data.video_id,
        status: 'processing'
      }
    } catch (error) {
      console.error('Error generating video with AI Video service:', error)
      throw error
    }
  }

  // Check video generation status
  async getVideoStatus(videoId: string): Promise<{ status: string; progress: number; outputUrl?: string }> {
    try {
      const response = await fetch(`${AI_VIDEO_API_BASE}/video/status?video_id=${videoId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get video status: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        status: data.data.status,
        progress: data.data.progress || 0,
        outputUrl: data.data.video_url
      }
    } catch (error) {
      console.error('Error getting video status:', error)
      return { status: 'error', progress: 0 }
    }
  }
}

export default AIVideoService
export type { AIVideoAvatar, AIVideoVoice }
