import { useState, useEffect } from 'react'
import AIVideoService, { AIVideoAvatar, AIVideoVoice } from '../services/aiVideoService'

const aiVideoService = new AIVideoService()

export const useAIVideo = () => {
  const [avatars, setAvatars] = useState<AIVideoAvatar[]>([])
  const [voices, setVoices] = useState<AIVideoVoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch avatars and voices on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [avatarsData, voicesData] = await Promise.all([
        aiVideoService.getAvatars(),
        aiVideoService.getVoices()
      ])
      
      setAvatars(avatarsData)
      setVoices(voicesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const playVoiceSample = async (voiceId: string) => {
    try {
      await aiVideoService.playVoiceSample(voiceId)
    } catch (err) {
      console.error('Error playing voice sample:', err)
    }
  }

  const generateVideo = async (params: {
    script: string
    avatarId: string
    voiceId: string
    settings: {
      duration: number
      quality: string
      style: string
    }
  }) => {
    try {
      return await aiVideoService.generateVideo(params)
    } catch (err) {
      throw err
    }
  }

  const getVideoStatus = async (videoId: string) => {
    try {
      return await aiVideoService.getVideoStatus(videoId)
    } catch (err) {
      throw err
    }
  }

  return {
    avatars,
    voices,
    loading,
    error,
    playVoiceSample,
    generateVideo,
    getVideoStatus,
    refetch: fetchData
  }
}
