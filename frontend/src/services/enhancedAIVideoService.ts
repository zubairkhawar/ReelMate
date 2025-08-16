import { VideoScene, VideoProject, BrandCustomization, RenderSettings } from '../types/videoWorkflow'

const AI_VIDEO_API_BASE = process.env.NEXT_PUBLIC_AI_VIDEO_API_URL || 'https://api.heygen.com/v1'

class EnhancedAIVideoService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_AI_VIDEO_API_KEY || ''
  }

  // Generate multiple video scenes in parallel
  async generateVideoScenes(scenes: VideoScene[]): Promise<VideoScene[]> {
    try {
      console.log('🎬 Starting multi-scene AI video generation...')
      console.log(`📊 Generating ${scenes.length} scenes`)

      // Generate all scenes in parallel
      const generationPromises = scenes.map(scene => this.generateSingleScene(scene))
      const results = await Promise.allSettled(generationPromises)

      // Process results and update scene statuses
      const updatedScenes = scenes.map((scene, index) => {
        const result = results[index]
        if (result.status === 'fulfilled') {
          return {
            ...scene,
            status: 'completed' as const,
            aiVideoJobId: result.value.jobId,
            videoUrl: result.value.videoUrl,
            thumbnailUrl: result.value.thumbnailUrl
          }
        } else {
          return {
            ...scene,
            status: 'failed' as const
          }
        }
      })

      console.log('✅ Multi-scene AI video generation completed')
      return updatedScenes
    } catch (error) {
      console.error('❌ Error in multi-scene AI video generation:', error)
      throw error
    }
  }

  // Generate a single video scene
  private async generateSingleScene(scene: VideoScene): Promise<{
    jobId: string
    videoUrl?: string
    thumbnailUrl?: string
  }> {
    try {
      console.log(`🎭 Generating scene ${scene.order}: ${scene.script.substring(0, 50)}...`)

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
                avatar_id: scene.avatarId,
                input_text: scene.script
              },
              voice: {
                type: 'text',
                input_text: scene.script,
                voice_id: scene.voiceId
              }
            }
          ],
          test: false,
          aspect_ratio: '9:16', // Default to vertical format
          quality: 'high',
          background: 'auto',
          metadata: {
            scene_order: scene.order,
            scene_id: scene.id
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate scene ${scene.order}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`✅ Scene ${scene.order} AI video generation started:`, data.data.video_id)

      return {
        jobId: data.data.video_id,
        videoUrl: undefined, // Will be populated when checking status
        thumbnailUrl: undefined
      }
    } catch (error) {
      console.error(`❌ Error generating scene ${scene.order}:`, error)
      throw error
    }
  }

  // Check status of multiple video generations
  async checkScenesStatus(scenes: VideoScene[]): Promise<VideoScene[]> {
    try {
      console.log('🔍 Checking status of all AI video scenes...')

      const statusPromises = scenes
        .filter(scene => scene.aiVideoJobId && scene.status === 'generating')
        .map(scene => this.checkSingleSceneStatus(scene))

      const results = await Promise.allSettled(statusPromises)

      // Update scenes with their current status
      const updatedScenes = scenes.map(scene => {
        if (scene.aiVideoJobId && scene.status === 'generating') {
          const result = results.find(r => 
            r.status === 'fulfilled' && r.value.jobId === scene.aiVideoJobId
          )
          
          if (result && result.status === 'fulfilled') {
            return {
              ...scene,
              status: result.value.status as VideoScene['status'],
              videoUrl: result.value.videoUrl,
              thumbnailUrl: result.value.thumbnailUrl
            }
          }
        }
        return scene
      })

      return updatedScenes
    } catch (error) {
      console.error('❌ Error checking AI video scenes status:', error)
      return scenes
    }
  }

  // Check status of a single video generation
  private async checkSingleSceneStatus(scene: VideoScene): Promise<{
    jobId: string
    status: string
    progress: number
    videoUrl?: string
    thumbnailUrl?: string
  }> {
    try {
      if (!scene.aiVideoJobId) {
        throw new Error('No job ID available')
      }

      const response = await fetch(`${AI_VIDEO_API_BASE}/video/status?video_id=${scene.aiVideoJobId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get status for scene ${scene.order}: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        jobId: scene.aiVideoJobId,
        status: data.data.status,
        progress: data.data.progress || 0,
        videoUrl: data.data.video_url,
        thumbnailUrl: data.data.thumbnail_url
      }
    } catch (error) {
      console.error(`❌ Error checking status for scene ${scene.order}:`, error)
      return {
        jobId: scene.aiVideoJobId || '',
        status: 'failed',
        progress: 0
      }
      }
    }
  }

  // Generate final composite video with brand customization
  async generateFinalVideo(
    scenes: VideoScene[],
    brandCustomization: BrandCustomization,
    renderSettings: RenderSettings
  ): Promise<{
    jobId: string
    status: string
    estimatedDuration: number
  }> {
    try {
      console.log('🎬 Starting final AI video composition...')
      console.log('🎨 Brand customization:', brandCustomization)
      console.log('⚙️ Render settings:', renderSettings)

      // This would typically call a video composition service
      // For now, we'll simulate the process
      const estimatedDuration = scenes.reduce((total, scene) => total + scene.duration, 0)

      // Simulate API call to video composition service
      const response = await fetch(`${AI_VIDEO_API_BASE}/video/compose`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scene_videos: scenes.map(scene => ({
            video_id: scene.aiVideoJobId,
            order: scene.order,
            duration: scene.duration
          })),
          brand_customization: brandCustomization,
          render_settings: renderSettings,
          output_format: renderSettings.format,
          quality: renderSettings.bitrate
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to start AI video composition: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Final AI video composition started:', data.data.composition_id)

      return {
        jobId: data.data.composition_id,
        status: 'processing',
        estimatedDuration
      }
    } catch (error) {
      console.error('❌ Error starting final AI video composition:', error)
      throw error
    }
  }

  // Get final video status and download URL
  async getFinalVideoStatus(compositionId: string): Promise<{
    status: string
    progress: number
    downloadUrl?: string
    previewUrl?: string
  }> {
    try {
      const response = await fetch(`${AI_VIDEO_API_BASE}/video/composition/status?composition_id=${compositionId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get AI video composition status: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        status: data.data.status,
        progress: data.data.progress || 0,
        downloadUrl: data.data.download_url,
        previewUrl: data.data.preview_url
      }
    } catch (error) {
      console.error('❌ Error getting final AI video status:', error)
      return {
        status: 'error',
        progress: 0
      }
    }
  }

  // Estimate cost for video generation
  async estimateCost(scenes: VideoScene[], quality: string): Promise<{
    totalCost: number
    costPerScene: number
    currency: string
    breakdown: {
      avatarCost: number
      voiceCost: number
      compositionCost: number
      renderCost: number
    }
  }> {
    try {
      // This would typically call the AI video service pricing API
      // For now, we'll provide estimated costs
      const costPerScene = quality === 'premium' ? 0.15 : quality === 'high' ? 0.10 : 0.05
      const compositionCost = 0.25
      const renderCost = quality === 'premium' ? 0.20 : quality === 'high' ? 0.15 : 0.10

      const totalCost = (scenes.length * costPerScene) + compositionCost + renderCost

      return {
        totalCost: Math.round(totalCost * 100) / 100,
        costPerScene: Math.round(costPerScene * 100) / 100,
        currency: 'USD',
        breakdown: {
          avatarCost: 0, // Included in scene cost
          voiceCost: 0, // Included in scene cost
          compositionCost: Math.round(compositionCost * 100) / 100,
          renderCost: Math.round(renderCost * 100) / 100
        }
      }
    } catch (error) {
      console.error('❌ Error estimating AI video cost:', error)
      return {
        totalCost: 0,
        costPerScene: 0,
        currency: 'USD',
        breakdown: {
          avatarCost: 0,
          voiceCost: 0,
          compositionCost: 0,
          renderCost: 0
        }
      }
    }
  }
}

export default EnhancedAIVideoService
