import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Palette, 
  Music, 
  Type, 
  Image, 
  Settings, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  Plus
} from 'lucide-react'
import { BrandCustomization } from '../../types/videoWorkflow'

interface BrandCustomizationPanelProps {
  customization: BrandCustomization
  onUpdate: (customization: BrandCustomization) => void
  onPreview: () => void
}

export default function BrandCustomizationPanel({
  customization,
  onUpdate,
  onPreview
}: BrandCustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'logo' | 'captions' | 'music' | 'overlays' | 'transitions'>('logo')
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.7)

  const tabs = [
    { id: 'logo', label: 'Logo & Branding', icon: Image },
    { id: 'captions', label: 'Captions & Text', icon: Type },
    { id: 'music', label: 'Background Music', icon: Music },
    { id: 'overlays', label: 'Overlays & CTAs', icon: Settings },
    { id: 'transitions', label: 'Transitions', icon: Palette }
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onUpdate({
          ...customization,
          logo: {
            ...customization.logo,
            url: e.target?.result as string,
            enabled: true
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoRemove = () => {
    onUpdate({
      ...customization,
      logo: {
        ...customization.logo,
        url: '',
        enabled: false
      }
    })
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onUpdate({
          ...customization,
          music: {
            ...customization.music,
            trackUrl: e.target?.result as string,
            enabled: true
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMusicToggle = () => {
    setIsPlayingMusic(!isPlayingMusic)
  }

  const handleAddOverlay = () => {
    const newOverlay = {
      id: `overlay-${Date.now()}`,
      type: 'text' as const,
      content: 'New Overlay',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      animation: 'fade-in',
      timing: { start: 0, end: 10 }
    }

    onUpdate({
      ...customization,
      overlays: {
        ...customization.overlays,
        elements: [...customization.overlays.elements, newOverlay]
      }
    })
  }

  const handleOverlayUpdate = (overlayId: string, updates: any) => {
    onUpdate({
      ...customization,
      overlays: {
        ...customization.overlays,
        elements: customization.overlays.elements.map(overlay =>
          overlay.id === overlayId ? { ...overlay, ...updates } : overlay
        )
      }
    })
  }

  const handleOverlayDelete = (overlayId: string) => {
    onUpdate({
      ...customization,
      overlays: {
        ...customization.overlays,
        elements: customization.overlays.elements.filter(overlay => overlay.id !== overlayId)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Brand Customization</h3>
        <button
          onClick={onPreview}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Logo & Branding Tab */}
        {activeTab === 'logo' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customization.logo.enabled}
                  onChange={(e) => onUpdate({
                    ...customization,
                    logo: { ...customization.logo, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">Enable Logo</span>
              </label>
            </div>

            {customization.logo.enabled && (
              <>
                {/* Logo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {customization.logo.url ? (
                    <div className="space-y-4">
                      <img
                        src={customization.logo.url}
                        alt="Brand Logo"
                        className="w-24 h-24 mx-auto object-contain"
                      />
                      <button
                        onClick={handleLogoRemove}
                        className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-purple-600 hover:text-purple-700 font-medium">
                            Click to upload logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      value={customization.logo.position}
                      onChange={(e) => onUpdate({
                        ...customization,
                        logo: { ...customization.logo, position: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={customization.logo.size}
                      onChange={(e) => onUpdate({
                        ...customization,
                        logo: { ...customization.logo, size: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation
                    </label>
                    <select
                      value={customization.logo.animation}
                      onChange={(e) => onUpdate({
                        ...customization,
                        logo: { ...customization.logo, animation: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="fade-in">Fade In</option>
                      <option value="slide-in">Slide In</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Captions Tab */}
        {activeTab === 'captions' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customization.captions.enabled}
                  onChange={(e) => onUpdate({
                    ...customization,
                    captions: { ...customization.captions, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">Enable Auto-Captions</span>
              </label>
            </div>

            {customization.captions.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font
                  </label>
                  <select
                    value={customization.captions.font}
                    onChange={(e) => onUpdate({
                      ...customization,
                      captions: { ...customization.captions, font: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={customization.captions.fontSize}
                    onChange={(e) => onUpdate({
                      ...customization,
                      captions: { ...customization.captions, fontSize: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{customization.captions.fontSize}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={customization.captions.color}
                    onChange={(e) => onUpdate({
                      ...customization,
                      captions: { ...customization.captions, color: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={customization.captions.backgroundColor}
                    onChange={(e) => onUpdate({
                      ...customization,
                      captions: { ...customization.captions, backgroundColor: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customization.music.enabled}
                  onChange={(e) => onUpdate({
                    ...customization,
                    music: { ...customization.music, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">Background Music</span>
              </label>
            </div>

            {customization.music.enabled && (
              <>
                {/* Music Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {customization.music.trackUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={handleMusicToggle}
                          className="p-3 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        >
                          {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Music Track</p>
                          <p className="text-sm text-gray-500">Uploaded audio file</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Volume2 className="w-4 h-4 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={musicVolume}
                          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">{Math.round(musicVolume * 100)}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Music className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-purple-600 hover:text-purple-700 font-medium">
                            Click to upload music
                          </span>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleMusicUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          MP3, WAV up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Music Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fade In (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={customization.music.fadeIn}
                      onChange={(e) => onUpdate({
                        ...customization,
                        music: { ...customization.music, fadeIn: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fade Out (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={customization.music.fadeOut}
                      onChange={(e) => onUpdate({
                        ...customization,
                        music: { ...customization.music, fadeOut: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Overlays Tab */}
        {activeTab === 'overlays' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customization.overlays.enabled}
                  onChange={(e) => onUpdate({
                    ...customization,
                    overlays: { ...customization.overlays, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">Custom Overlays</span>
              </label>
              <button
                onClick={handleAddOverlay}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Overlay</span>
              </button>
            </div>

            {customization.overlays.enabled && (
              <div className="space-y-4">
                {customization.overlays.elements.map((overlay, index) => (
                  <div key={overlay.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Overlay {index + 1}</h4>
                      <button
                        onClick={() => handleOverlayDelete(overlay.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <input
                          type="text"
                          value={overlay.content}
                          onChange={(e) => handleOverlayUpdate(overlay.id, { content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={overlay.type}
                          onChange={(e) => handleOverlayUpdate(overlay.id, { type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                          <option value="shape">Shape</option>
                          <option value="cta">Call to Action</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Transitions Tab */}
        {activeTab === 'transitions' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customization.transitions.enabled}
                  onChange={(e) => onUpdate({
                    ...customization,
                    transitions: { ...customization.transitions, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">Scene Transitions</span>
              </label>
            </div>

            {customization.transitions.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transition Type
                  </label>
                  <select
                    value={customization.transitions.type}
                    onChange={(e) => onUpdate({
                      ...customization,
                      transitions: { ...customization.transitions, type: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                    <option value="dissolve">Dissolve</option>
                    <option value="wipe">Wipe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={customization.transitions.duration}
                    onChange={(e) => onUpdate({
                      ...customization,
                      transitions: { ...customization.transitions, duration: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
