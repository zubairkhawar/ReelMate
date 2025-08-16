import { useState, useEffect } from 'react'
import HeyGenService, { HeyGenAvatar, HeyGenVoice } from '../services/heygenService'

const heygenService = new HeyGenService()

export const useHeyGen = () => {
  const [avatars, setAvatars] = useState<HeyGenAvatar[]>([])
  const [voices, setVoices] = useState<HeyGenVoice[]>([])
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
        heygenService.getAvatars(),
        heygenService.getVoices()
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
      await heygenService.playVoiceSample(voiceId)
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
      return await heygenService.generateVideo(params)
    } catch (err) {
      throw err
    }
  }

  const getVideoStatus = async (videoId: string) => {
    try {
      return await heygenService.getVideoStatus(videoId)
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
