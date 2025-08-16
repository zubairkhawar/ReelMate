import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Users, Sparkles, Loader2 } from 'lucide-react'
import { HeyGenAvatar } from '../../services/heygenService'

interface AvatarSelectorProps {
  avatars: HeyGenAvatar[]
  selectedAvatar: string
  onAvatarSelect: (avatarId: string) => void
  loading?: boolean
}

export default function AvatarSelector({ 
  avatars, 
  selectedAvatar, 
  onAvatarSelect, 
  loading = false 
}: AvatarSelectorProps) {
  const [previewAvatar, setPreviewAvatar] = useState<HeyGenAvatar | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading avatars...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Avatar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {avatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            onClick={() => onAvatarSelect(avatar.id)}
            onMouseEnter={() => setPreviewAvatar(avatar)}
            onMouseLeave={() => setPreviewAvatar(null)}
            className={`relative group p-4 border-2 rounded-xl text-center transition-all duration-200 ${
              selectedAvatar === avatar.id
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Avatar Image */}
            <div className="relative mb-3">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {avatar.thumbnail_url ? (
                  <img
                    src={avatar.thumbnail_url}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=6366f1&color=fff&size=80`
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                )}
              </div>
              
              {/* Selection Indicator */}
              {selectedAvatar === avatar.id && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Avatar Info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-900 text-sm">{avatar.name}</p>
              <p className="text-xs text-gray-500">{avatar.style}</p>
              <p className="text-xs text-gray-400">{avatar.ethnicity}</p>
            </div>

            {/* Hover Preview */}
            {previewAvatar?.id === avatar.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-2">
                    {avatar.preview_url ? (
                      <img
                        src={avatar.preview_url}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{avatar.name}</p>
                  <p className="text-xs text-gray-600 mb-2">{avatar.style}</p>
                  
                  {avatar.metadata && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {avatar.metadata.age && <p>Age: {avatar.metadata.age}</p>}
                      {avatar.metadata.profession && <p>Profession: {avatar.metadata.profession}</p>}
                      {avatar.metadata.personality && <p>Personality: {avatar.metadata.personality}</p>}
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center justify-center text-purple-600">
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="text-xs">Preview</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Avatar Details */}
      {selectedAvatar && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100">
              {avatars.find(a => a.id === selectedAvatar)?.thumbnail_url ? (
                <img
                  src={avatars.find(a => a.id === selectedAvatar)?.thumbnail_url}
                  alt="Selected avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-purple-900">
                {avatars.find(a => a.id === selectedAvatar)?.name}
              </p>
              <p className="text-sm text-purple-700">
                {avatars.find(a => a.id === selectedAvatar)?.style} • {avatars.find(a => a.id === selectedAvatar)?.ethnicity}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
