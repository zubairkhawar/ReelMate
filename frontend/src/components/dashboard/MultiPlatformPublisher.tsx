import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Calendar, 
  Target, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Play,
  Pause,
  Trash2,
  Edit3,
  Eye,
  Share2,
  Download,
  Settings
} from 'lucide-react'
import { PublishingTarget, VideoAnalytics } from '../../types/videoWorkflow'
import { 
  TikTokLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  FacebookLogo, 
  MultiPlatformLogo 
} from '../logos'

interface MultiPlatformPublisherProps {
  videoUrl: string
  videoTitle: string
  videoDescription: string
  onPublish: (targets: PublishingTarget[]) => void
  onSchedule: (targets: PublishingTarget[], scheduledTime: string) => void
}

const platformConfig = {
  tiktok: { logo: TikTokLogo, name: 'TikTok', color: 'from-pink-500 to-purple-600' },
  instagram: { logo: InstagramLogo, name: 'Instagram', color: 'from-purple-500 to-pink-600' },
  youtube: { logo: YouTubeLogo, name: 'YouTube', color: 'from-red-500 to-red-600' },
  facebook: { logo: FacebookLogo, name: 'Facebook', color: 'from-blue-500 to-blue-600' },
  linkedin: { logo: MultiPlatformLogo, name: 'LinkedIn', color: 'from-blue-600 to-blue-700' }
}

export default function MultiPlatformPublisher({
  videoUrl,
  videoTitle,
  videoDescription,
  onPublish,
  onSchedule
}: MultiPlatformPublisherProps) {
  const [publishingTargets, setPublishingTargets] = useState<PublishingTarget[]>([])
  const [scheduledTime, setScheduledTime] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishMode, setPublishMode] = useState<'immediate' | 'scheduled'>('immediate')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null)

  // Mock connected accounts - in real app, these would come from API
  const connectedAccounts = [
    { platform: 'tiktok', accountId: 'tiktok_123', accountName: 'Brand TikTok', isConnected: true },
    { platform: 'instagram', accountId: 'instagram_456', accountName: 'Brand Instagram', isConnected: true },
    { platform: 'youtube', accountId: 'youtube_789', accountName: 'Brand YouTube', isConnected: true },
    { platform: 'facebook', accountId: 'facebook_101', accountName: 'Brand Facebook', isConnected: true },
    { platform: 'linkedin', accountId: 'linkedin_202', accountName: 'Brand LinkedIn', isConnected: false }
  ]

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to publish to')
      return
    }

    setIsPublishing(true)
    try {
      const targets: PublishingTarget[] = selectedPlatforms.map(platform => {
        const account = connectedAccounts.find(acc => acc.platform === platform)
        return {
          platform: platform as any,
          accountId: account?.accountId || '',
          accountName: account?.accountName || '',
          autoPublish: true,
          scheduledTime: publishMode === 'scheduled' ? scheduledTime : undefined
        }
      })

      if (publishMode === 'scheduled') {
        await onSchedule(targets, scheduledTime)
      } else {
        await onPublish(targets)
      }

      // Simulate publishing process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Video ${publishMode === 'scheduled' ? 'scheduled' : 'published'} successfully to ${selectedPlatforms.length} platform(s)!`)
    } catch (error) {
      console.error('Publishing failed:', error)
      alert('Failed to publish video. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleAdCampaignSetup = (platform: string) => {
    // This would open ad campaign setup modal
    alert(`Setting up ad campaign for ${platform}`)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <Play className="w-16 h-16 text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{videoTitle}</h4>
              <p className="text-sm text-gray-600">{videoDescription}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700">Video Details</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Quality:</span>
                <span>1080p</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span>MP4</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>15.2 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Publishing Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(platformConfig).map(([platform, config]) => {
            const Logo = config.logo
            const account = connectedAccounts.find(acc => acc.platform === platform)
            const isSelected = selectedPlatforms.includes(platform)
            
            return (
              <motion.button
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`relative p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${!account?.isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!account?.isConnected}
                whileHover={{ scale: account?.isConnected ? 1.02 : 1 }}
                whileTap={{ scale: account?.isConnected ? 0.98 : 1 }}
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Logo className="w-8 h-8" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{config.name}</p>
                    <p className="text-sm text-gray-500">{account?.accountName || 'Not connected'}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                
                {!account?.isConnected && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500">
                    Connect account to publish
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
        
        <div className="space-y-4">
          {/* Publish Mode */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="immediate"
                checked={publishMode === 'immediate'}
                onChange={(e) => setPublishMode(e.target.value as any)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-700">Publish Immediately</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="scheduled"
                checked={publishMode === 'scheduled'}
                onChange={(e) => setPublishMode(e.target.value as any)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-700">Schedule for Later</span>
            </label>
          </div>

          {/* Schedule Time */}
          {publishMode === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Time
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Ad Campaign Setup */}
          <div className="border-t border-gray-200 pt-4">
            <h5 className="font-medium text-gray-700 mb-3">Ad Campaign Setup (Optional)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPlatforms.map(platform => {
                const config = platformConfig[platform as keyof typeof platformConfig]
                return (
                  <div key={platform} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <config.logo className="w-5 h-5" />
                      <span className="text-sm font-medium text-gray-700">{config.name}</span>
                    </div>
                    <button
                      onClick={() => handleAdCampaignSetup(platform)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Setup Ads
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      {analytics && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(analytics.views)}</div>
              <div className="text-sm text-blue-700">Estimated Views</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.engagement}%</div>
              <div className="text-sm text-green-700">Engagement Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(analytics.shares)}</div>
              <div className="text-sm text-purple-700">Expected Shares</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.clickThroughRate}%</div>
              <div className="text-sm text-orange-700">CTR</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {selectedPlatforms.length > 0 && (
            <span>Ready to publish to {selectedPlatforms.length} platform(s)</span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.open(videoUrl, '_blank')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing || selectedPlatforms.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              isPublishing || selectedPlatforms.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isPublishing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>
                  {publishMode === 'scheduled' ? 'Schedule' : 'Publish'} to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
