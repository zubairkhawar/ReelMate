'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  FileText, 
  User, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Heart,
  Share2,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Volume2,
  Globe,
  Clock,
  Hash,
  Zap,
  Eye,
  Copy,
  Trash2,
  Save,
  History,
  Palette,
  Sliders
} from 'lucide-react'

interface PromptTemplate {
  id: string
  name: string
  category: string
  description: string
  isFavorite: boolean
  isShared: boolean
  usage: number
  rating: number
}

interface Avatar {
  id: string
  name: string
  gender: string
  ethnicity: string
  style: string
  thumbnail: string
  sampleClip: string
}

interface Voice {
  id: string
  name: string
  gender: string
  accent: string
  language: string
  tone: string
  sampleAudio: string
}

const promptTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Product Showcase',
    category: 'Demo',
    description: 'Highlight product features with compelling storytelling',
    isFavorite: true,
    isShared: false,
    usage: 156,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Customer Testimonial',
    category: 'Testimonial',
    description: 'Authentic customer story with emotional connection',
    isFavorite: false,
    isShared: true,
    usage: 89,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Pain-Agitate-Solve',
    category: 'Pain-Agitate-Solve',
    description: 'Identify problem, amplify pain, present solution',
    isFavorite: true,
    isShared: true,
    usage: 234,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Before & After',
    category: 'Comparison',
    description: 'Show transformation with clear before/after states',
    isFavorite: false,
    isShared: false,
    usage: 67,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Urgency CTA',
    category: 'CTA',
    description: 'Create urgency with limited-time offers',
    isFavorite: false,
    isShared: false,
    usage: 45,
    rating: 4.5
  }
]

const avatars: Avatar[] = [
  {
    id: '1',
    name: 'Sarah',
    gender: 'Female',
    ethnicity: 'Caucasian',
    style: 'Professional',
    thumbnail: '/api/placeholder/80/80',
    sampleClip: '/api/placeholder/video'
  },
  {
    id: '2',
    name: 'Marcus',
    gender: 'Male',
    ethnicity: 'African American',
    style: 'Casual',
    thumbnail: '/api/placeholder/80/80',
    sampleClip: '/api/placeholder/video'
  },
  {
    id: '3',
    name: 'Priya',
    gender: 'Female',
    ethnicity: 'South Asian',
    style: 'Friendly',
    thumbnail: '/api/placeholder/80/80',
    sampleClip: '/api/placeholder/video'
  },
  {
    id: '4',
    name: 'Alex',
    gender: 'Male',
    ethnicity: 'Hispanic',
    style: 'Energetic',
    thumbnail: '/api/placeholder/80/80',
    sampleClip: '/api/placeholder/video'
  }
]

const voices: Voice[] = [
  {
    id: '1',
    name: 'US Male Neutral',
    gender: 'Male',
    accent: 'American',
    language: 'English',
    tone: 'Neutral',
    sampleAudio: '/api/placeholder/audio'
  },
  {
    id: '2',
    name: 'UK Female Warm',
    gender: 'Female',
    accent: 'British',
    language: 'English',
    tone: 'Warm',
    sampleAudio: '/api/placeholder/audio'
  },
  {
    id: '3',
    name: 'Energetic',
    gender: 'Male',
    accent: 'American',
    language: 'English',
    tone: 'Energetic',
    sampleAudio: '/api/placeholder/audio'
  },
  {
    id: '4',
    name: 'Calm',
    gender: 'Female',
    accent: 'American',
    language: 'English',
    tone: 'Calm',
    sampleAudio: '/api/placeholder/audio'
  }
]

export default function AIStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [selectedAvatar, setSelectedAvatar] = useState<string>('1')
  const [selectedVoice, setSelectedVoice] = useState<string>('1')
  const [script, setScript] = useState('')
  const [toneSettings, setToneSettings] = useState({
    excited: 50,
    formal: 50
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const characterCount = script.length
  const estimatedDuration = Math.ceil(characterCount / 150) // Rough estimate: 150 chars per second

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Studio</h1>
          <p className="text-gray-600 mt-1">Creative control center for prompts, avatars, voices, and templates</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <History className="w-4 h-4 mr-2 inline" />
            History
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Generate Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Prompt Library */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Prompt Library</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Categories</option>
                <option value="testimonial">Testimonial</option>
                <option value="demo">Demo</option>
                <option value="pain-agitate-solve">Pain-Agitate-Solve</option>
                <option value="comparison">Comparison</option>
                <option value="cta">CTA</option>
              </select>
            </div>

            {/* Templates List */}
            <div className="space-y-3">
              {promptTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                    <div className="flex items-center space-x-1">
                      {template.isFavorite && (
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      )}
                      {template.isShared && (
                        <Share2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.usage} uses</span>
                    <span>★ {template.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Script Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Script Editor</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Save className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Script Input */}
            <div className="mb-6">
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Write your script here... The AI will help you create compelling content that converts."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Script Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-4">
                <span>{characterCount} characters</span>
                <span>•</span>
                <span>~{estimatedDuration}s estimated</span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Auto-generate script
              </button>
            </div>

            {/* Tone Controls */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Tone Adjustment</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Excited ↔ Calm</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={toneSettings.excited}
                    onChange={(e) => setToneSettings({...toneSettings, excited: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Calm</span>
                    <span>Excited</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Formal ↔ Conversational</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={toneSettings.formal}
                    onChange={(e) => setToneSettings({...toneSettings, formal: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conversational</span>
                    <span>Formal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Advanced Options</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Humanize speech</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Profanity check</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Estimated cost per video</label>
                    <div className="text-lg font-semibold text-green-600">$0.15 - $0.25</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Avatar & Voice */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h3>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedAvatar === avatar.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm text-center">{avatar.name}</h4>
                  <p className="text-xs text-gray-500 text-center">{avatar.style}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Upload Custom Avatar
              </button>
            </div>
          </div>

          {/* Voice Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice</h3>
            <div className="space-y-3">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedVoice === voice.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{voice.name}</h4>
                      <p className="text-xs text-gray-500">{voice.accent} • {voice.tone}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Mic className="w-4 h-4 mr-2" />
                Clone Voice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Preview Pane */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              Regenerate
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2 inline" />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audio Preview */}
          <div className="lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-3">Audio Preview</h4>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <p className="text-sm text-gray-600 mt-2">Click to preview TTS audio</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-gray-900 mb-3">Video Preview</h4>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Lip-synced avatar preview</p>
              <p className="text-xs text-gray-500 mt-1">Low-res fast preview</p>
            </div>
          </div>
        </div>

        {/* Variation Slider */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Variation Control</h4>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Small changes</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="flex-1"
            />
            <span className="text-sm text-gray-600">Large changes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
