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
  TrendingUp
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
    </div>
  )
}
