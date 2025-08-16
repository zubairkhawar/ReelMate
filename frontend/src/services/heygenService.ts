// HeyGen API Service for avatars and voices
const HEYGEN_API_BASE = process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com/v1'

interface HeyGenAvatar {
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

interface HeyGenVoice {
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

class HeyGenService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY || ''
  }

  // Fetch all available avatars from HeyGen
  async getAvatars(): Promise<HeyGenAvatar[]> {
    try {
      const response = await fetch(`${HEYGEN_API_BASE}/avatar/list`, {
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
      return data.data?.avatars || []
    } catch (error) {
      console.error('Error fetching HeyGen avatars:', error)
      // Return fallback avatars if API fails
      return this.getFallbackAvatars()
    }
  }

  // Fetch all available voices from HeyGen
  async getVoices(): Promise<HeyGenVoice[]> {
    try {
      const response = await fetch(`${HEYGEN_API_BASE}/voice/list`, {
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
      return data.data?.voices || []
    } catch (error) {
      console.error('Error fetching HeyGen voices:', error)
      // Return fallback voices if API fails
      return this.getFallbackVoices()
    }
  }

  // Play voice sample
  async playVoiceSample(voiceId: string): Promise<void> {
    try {
      const voices = await this.getVoices()
      const voice = voices.find(v => v.id === voiceId)
      
      if (voice?.sample_url) {
        const audio = new Audio(voice.sample_url)
        audio.play()
      } else {
        console.warn('No sample URL available for this voice')
      }
    } catch (error) {
      console.error('Error playing voice sample:', error)
    }
  }

  // Generate video with HeyGen
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
      const response = await fetch(`${HEYGEN_API_BASE}/video/generate`, {
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
        throw new Error(`Failed to generate video: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        jobId: data.data.video_id,
        status: 'processing'
      }
    } catch (error) {
      console.error('Error generating video with HeyGen:', error)
      throw error
    }
  }

  // Check video generation status
  async getVideoStatus(videoId: string): Promise<{ status: string; progress: number; outputUrl?: string }> {
    try {
      const response = await fetch(`${HEYGEN_API_BASE}/video/status?video_id=${videoId}`, {
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

  // Fallback avatars if API fails
  private getFallbackAvatars(): HeyGenAvatar[] {
    return [
      {
        id: 'fallback-1',
        name: 'Sarah',
        gender: 'Female',
        ethnicity: 'Caucasian',
        style: 'Professional',
        thumbnail_url: '/api/placeholder/avatar/sarah',
        is_active: true
      },
      {
        id: 'fallback-2',
        name: 'Marcus',
        gender: 'Male',
        ethnicity: 'African American',
        style: 'Casual',
        thumbnail_url: '/api/placeholder/avatar/marcus',
        is_active: true
      },
      {
        id: 'fallback-3',
        name: 'Priya',
        gender: 'Female',
        ethnicity: 'South Asian',
        style: 'Friendly',
        thumbnail_url: '/api/placeholder/avatar/priya',
        is_active: true
      },
      {
        id: 'fallback-4',
        name: 'Alex',
        gender: 'Male',
        ethnicity: 'Hispanic',
        style: 'Energetic',
        thumbnail_url: '/api/placeholder/avatar/alex',
        is_active: true
      }
    ]
  }

  // Fallback voices if API fails
  private getFallbackVoices(): HeyGenVoice[] {
    return [
      {
        id: 'fallback-1',
        name: 'Emma',
        gender: 'Female',
        accent: 'US English',
        language: 'English',
        tone: 'Warm & Friendly',
        is_active: true
      },
      {
        id: 'fallback-2',
        name: 'James',
        gender: 'Male',
        accent: 'British',
        language: 'English',
        tone: 'Professional',
        is_active: true
      },
      {
        id: 'fallback-3',
        name: 'Sophia',
        gender: 'Female',
        accent: 'Australian',
        language: 'English',
        tone: 'Casual',
        is_active: true
      },
      {
        id: 'fallback-4',
        name: 'Michael',
        gender: 'Male',
        accent: 'US English',
        language: 'English',
        tone: 'Energetic',
        is_active: true
      }
    ]
  }
}

export default HeyGenService
export type { HeyGenAvatar, HeyGenVoice }
