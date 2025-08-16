import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Eye } from 'lucide-react'
import { AIVideoAvatar } from '../../services/aiVideoService'

interface AvatarSelectorProps {
  avatars: AIVideoAvatar[]
  selectedAvatar: string
  onAvatarSelect: (avatarId: string) => void
  loading: boolean
}

export default function AvatarSelector({
  avatars,
  selectedAvatar,
  onAvatarSelect,
  loading
}: AvatarSelectorProps) {
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (avatars.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No avatars available</p>
        <p className="text-sm text-gray-400">Please check your API configuration</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {avatars.map((avatar) => (
          <motion.div
            key={avatar.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedAvatar === avatar.id
                ? 'border-purple-500 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onAvatarSelect(avatar.id)}
            onMouseEnter={() => setHoveredAvatar(avatar.id)}
            onMouseLeave={() => setHoveredAvatar(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Avatar Thumbnail */}
            <div className="aspect-square bg-gray-100">
              {avatar.thumbnail_url ? (
                <img
                  src={avatar.thumbnail_url}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Avatar Info */}
            <div className="p-3 bg-white">
              <h4 className="font-medium text-gray-900 text-sm">{avatar.name}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>{avatar.gender}</span>
                <span>{avatar.style}</span>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedAvatar === avatar.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            {/* Hover Preview */}
            {hoveredAvatar === avatar.id && avatar.preview_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10"
              >
                <div className="text-center text-white">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Preview</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Avatar Details */}
      {selectedAvatar && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Selected Avatar</h4>
          {(() => {
            const avatar = avatars.find(a => a.id === selectedAvatar)
            if (!avatar) return null
            
            return (
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  {avatar.thumbnail_url ? (
                    <img
                      src={avatar.thumbnail_url}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-purple-900">{avatar.name}</p>
                  <p className="text-sm text-purple-700">{avatar.gender} • {avatar.style}</p>
                  {avatar.metadata?.profession && (
                    <p className="text-xs text-purple-600">{avatar.metadata.profession}</p>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
