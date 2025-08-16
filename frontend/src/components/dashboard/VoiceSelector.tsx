import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Play, Pause, Volume2, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { HeyGenVoice } from '../../services/heygenService'

interface VoiceSelectorProps {
  voices: HeyGenVoice[]
  selectedVoice: string
  onVoiceSelect: (voiceId: string) => void
  onPlaySample: (voiceId: string) => void
  loading?: boolean
}

export default function VoiceSelector({ 
  voices, 
  selectedVoice, 
  onVoiceSelect, 
  onPlaySample, 
  loading = false 
}: VoiceSelectorProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)

  const handlePlaySample = async (voiceId: string) => {
    try {
      setAudioError(null)
      setPlayingVoice(voiceId)
      
      // Create audio element for better control
      const audio = new Audio()
      audio.src = voices.find(v => v.id === voiceId)?.sample_url || ''
      
      audio.onended = () => setPlayingVoice(null)
      audio.onerror = () => {
        setPlayingVoice(null)
        setAudioError('Failed to play voice sample')
      }
      
      await audio.play()
      onPlaySample(voiceId)
    } catch (error) {
      setPlayingVoice(null)
      setAudioError('Failed to play voice sample')
      console.error('Error playing voice sample:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading voices...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voices.map((voice) => (
          <motion.button
            key={voice.id}
            onClick={() => onVoiceSelect(voice.id)}
            className={`relative group p-4 border-2 rounded-xl text-left transition-all duration-200 ${
              selectedVoice === voice.id
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Voice Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{voice.name}</p>
                  <p className="text-sm text-gray-600">{voice.tone}</p>
                </div>
              </div>
              
              {/* Selection Indicator */}
              {selectedVoice === voice.id && (
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Voice Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Volume2 className="w-3 h-3 mr-1" />
                  {voice.accent}
                </span>
                <span>•</span>
                <span>{voice.language}</span>
                <span>•</span>
                <span>{voice.gender}</span>
              </div>
              
              {voice.metadata && (
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  {voice.metadata.age && <span>Age: {voice.metadata.age}</span>}
                  {voice.metadata.emotion && <span>Emotion: {voice.metadata.emotion}</span>}
                  {voice.metadata.speed && <span>Speed: {voice.metadata.speed}</span>}
                </div>
              )}
            </div>

            {/* Play Sample Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlaySample(voice.id)
                }}
                disabled={!voice.sample_url}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 ${
                  voice.sample_url
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {playingVoice === voice.id ? (
                  <>
                    <Pause className="w-3 h-3 mr-1" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Play Sample
                  </>
                )}
              </button>
              
              {!voice.sample_url && (
                <span className="text-xs text-gray-400">No sample available</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Audio Error Message */}
      {audioError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{audioError}</span>
        </motion.div>
      )}

      {/* Selected Voice Details */}
      {selectedVoice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-900">
                {voices.find(v => v.id === selectedVoice)?.name}
              </p>
              <p className="text-sm text-purple-700">
                {voices.find(v => v.id === selectedVoice)?.tone} • {voices.find(v => v.id === selectedVoice)?.accent}
              </p>
            </div>
            <button
              onClick={() => handlePlaySample(selectedVoice)}
              disabled={!voices.find(v => v.id === selectedVoice)?.sample_url}
              className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
