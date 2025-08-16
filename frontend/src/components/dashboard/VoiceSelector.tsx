import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Play, Pause, Loader2 } from 'lucide-react'
import { AIVideoVoice } from '../../services/aiVideoService'

interface VoiceSelectorProps {
  voices: AIVideoVoice[]
  selectedVoice: string
  onVoiceSelect: (voiceId: string) => void
  onPlaySample: (voiceId: string) => Promise<void>
  loading: boolean
}

export default function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceSelect,
  onPlaySample,
  loading
}: VoiceSelectorProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)

  const handlePlaySample = async (voiceId: string) => {
    try {
      setPlayingVoice(voiceId)
      setAudioError(null)
      await onPlaySample(voiceId)
      
      // Stop playing after a few seconds
      setTimeout(() => {
        setPlayingVoice(null)
      }, 3000)
    } catch (error) {
      console.error('Error playing voice sample:', error)
      setAudioError('Failed to play voice sample')
      setPlayingVoice(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (voices.length === 0) {
    return (
      <div className="text-center py-8">
        <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No voices available</p>
        <p className="text-sm text-gray-400">Please check your API configuration</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {voices.map((voice) => (
          <motion.div
            key={voice.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedVoice === voice.id
                ? 'border-purple-500 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onVoiceSelect(voice.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Voice Card */}
            <div className="p-4 bg-white">
              {/* Voice Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>

              {/* Voice Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm">{voice.name}</h4>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>{voice.gender} • {voice.accent}</p>
                  <p>{voice.language} • {voice.tone}</p>
                </div>
              </div>

              {/* Play Button */}
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlaySample(voice.id)
                  }}
                  disabled={!voice.sample_url}
                  className={`w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    voice.sample_url
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {playingVoice === voice.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play Sample
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedVoice === voice.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      {audioError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{audioError}</p>
        </div>
      )}

      {/* Selected Voice Details */}
      {selectedVoice && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Selected Voice</h4>
          {(() => {
            const voice = voices.find(v => v.id === selectedVoice)
            if (!voice) return null
            
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">{voice.name}</p>
                    <p className="text-sm text-purple-700">{voice.gender} • {voice.accent}</p>
                    <p className="text-xs text-purple-600">{voice.language} • {voice.tone}</p>
                  </div>
                </div>
                
                {/* Play Selected Voice */}
                <button
                  onClick={() => handlePlaySample(voice.id)}
                  disabled={!voice.sample_url}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    voice.sample_url
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {playingVoice === voice.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </button>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
