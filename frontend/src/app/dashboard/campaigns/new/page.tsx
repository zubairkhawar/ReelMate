'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Save,
  Video,
  Sparkles,
  Target,
  Users,
  Calendar,
  DollarSign,
  Play,
  Camera,
  Share2,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Heart,
  Share2 as ShareIcon,
  Volume2,
  RotateCcw,
  Download,
  History,
  Palette,
  Sliders,
  ChevronDown,
  ChevronRight,
  X,
  Mic
} from 'lucide-react'
import Link from 'next/link'

const campaignTypes = [
  { value: 'ugc-video', label: 'UGC Video Campaign', icon: Video, description: 'Create authentic user-generated content videos', color: 'from-purple-500 to-pink-600' },
  { value: 'ai-generated', label: 'AI-Generated Videos', icon: Sparkles, description: 'Use AI to create engaging video content', color: 'from-blue-500 to-purple-600' },
  { value: 'user-submitted', label: 'User Submitted Content', icon: Users, description: 'Collect and curate videos from your community', color: 'from-green-500 to-emerald-600' },
  { value: 'branded-content', label: 'Branded Content Series', icon: Target, description: 'Professional branded video campaigns', color: 'from-orange-500 to-red-600' }
]

const platformOptions = [
  { value: 'tiktok', label: 'TikTok', icon: '🎵', description: 'Short-form vertical videos' },
  { value: 'instagram', label: 'Instagram', icon: '📷', description: 'Reels and IGTV content' },
  { value: 'youtube', label: 'YouTube', icon: '▶️', description: 'Long-form video content' },
  { value: 'facebook', label: 'Facebook', icon: '📘', description: 'Social media video posts' },
  { value: 'multi-platform', label: 'Multi-Platform', icon: '🌐', description: 'Cross-platform distribution' }
]

const videoFormats = [
  { value: 'short-form', label: 'Short Form (15-60s)', description: 'Perfect for TikTok, Instagram Reels' },
  { value: 'medium-form', label: 'Medium Form (1-3 min)', description: 'Great for Instagram, Facebook' },
  { value: 'long-form', label: 'Long Form (3+ min)', description: 'Ideal for YouTube, detailed content' }
]

// AI Studio Data
const promptTemplates = [
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

const avatars = [
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

const voices = [
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

export default function NewCampaignPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    platforms: [] as string[],
    videoFormat: '',
    targetAudience: '',
    videoCount: '',
    budget: '',
    startDate: '',
    endDate: '',
    hashtags: '',
    callToAction: ''
  })

  // AI Studio States
  const [showAIStudio, setShowAIStudio] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('UGC Campaign data:', formData)
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to UGC Campaigns
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New UGC Campaign</h1>
            <p className="text-gray-600 mt-1">Set up your User Generated Content video campaign and start creating authentic content</p>
          </div>
        </div>
      </div>

      {/* Campaign Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Collection UGC Challenge"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Campaign Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Campaign Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign goals, target audience, and the type of content you want to create..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Platforms *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {platformOptions.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.platforms.includes(platform.value)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{platform.icon}</span>
                    <span>{platform.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{platform.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Video Format & Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Play className="w-4 h-4 inline mr-2" />
                Video Format
              </label>
              <select
                value={formData.videoFormat}
                onChange={(e) => setFormData({ ...formData, videoFormat: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select video format</option>
                {videoFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} - {format.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Video className="w-4 h-4 inline mr-2" />
                Number of Videos
              </label>
              <input
                type="number"
                value={formData.videoCount}
                onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
                placeholder="e.g., 10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Target Audience & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Fashion enthusiasts, 18-35 years old"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Campaign Budget
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g., 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Campaign Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Hashtags & CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Campaign Hashtags
              </label>
              <input
                type="text"
                value={formData.hashtags}
                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                placeholder="e.g., #SummerStyle #UGCCampaign #FashionForward"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Share2 className="w-4 h-4 inline mr-2" />
                Call to Action
              </label>
              <input
                type="text"
                value={formData.callToAction}
                onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                placeholder="e.g., Share your video with #SummerStyle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard/campaigns"
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Create UGC Campaign
            </button>
          </div>
        </form>
      </motion.div>

      {/* AI Studio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Studio</h2>
            <p className="text-gray-600 mt-1">Creative control center for prompts, avatars, voices, and templates</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <History className="w-4 h-4 mr-2 inline" />
              History
            </button>
            <button 
              onClick={() => setShowAIStudio(!showAIStudio)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              {showAIStudio ? 'Hide AI Studio' : 'Generate Video'}
            </button>
          </div>
        </div>

        {showAIStudio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Panel - Prompt Library */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
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
                            ? 'border-purple-500 bg-purple-50'
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
                              <ShareIcon className="w-4 h-4 text-blue-500" />
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
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
                      className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Script Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                    <div className="flex items-center space-x-4">
                      <span>{characterCount} characters</span>
                      <span>•</span>
                      <span>~{estimatedDuration}s estimated</span>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
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
                            <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            <span className="text-sm text-gray-700">Humanize speech</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
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
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAvatar === avatar.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
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
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice</h3>
                  <div className="space-y-3">
                    {voices.map((voice) => (
                      <div
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedVoice === voice.id
                            ? 'border-purple-500 bg-purple-50'
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
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <RotateCcw className="w-4 h-4 mr-2 inline" />
                    Regenerate
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audio Preview */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-3">Audio Preview</h4>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-200"
                    >
                      {isPlaying ? <Play className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">Click to preview TTS audio</p>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="lg:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Video Preview</h4>
                  <div className="bg-white rounded-lg p-8 text-center">
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
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
