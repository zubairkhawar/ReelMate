'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
  Mic,
  Edit3,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Lightbulb,
  MessageSquare,
  Settings,
  BarChart3,
  Youtube,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react'
import { 
  TikTokLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  FacebookLogo, 
  MultiPlatformLogo 
} from '../../../../components/logos'
import { useAIVideo } from '../../../../hooks/useAIVideo'
import AvatarSelector from '../../../../components/dashboard/AvatarSelector'
import VoiceSelector from '../../../../components/dashboard/VoiceSelector'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// API endpoints
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const campaignTypes = [
  { value: 'ugc-video', label: 'UGC Video Campaign', icon: Video, color: 'from-purple-500 to-pink-600' },
  { value: 'ai-generated', label: 'AI-Generated Videos', icon: Sparkles, color: 'from-blue-500 to-purple-600' },
  { value: 'user-submitted', label: 'User Submitted Content', icon: Users, color: 'from-green-500 to-emerald-600' },
  { value: 'branded-content', label: 'Branded Content Series', icon: Target, color: 'from-orange-500 to-red-600' }
]

const platformOptions = [
  { value: 'tiktok', label: 'TikTok', icon: TikTokLogo, color: 'from-pink-500 to-purple-600' },
  { value: 'instagram', label: 'Instagram', icon: InstagramLogo, color: 'from-purple-500 to-pink-600' },
  { value: 'youtube', label: 'YouTube', icon: YouTubeLogo, color: 'from-red-500 to-red-600' },
  { value: 'facebook', label: 'Facebook', icon: FacebookLogo, color: 'from-blue-500 to-blue-600' },
  { value: 'multi-platform', label: 'Multi-Platform', icon: MultiPlatformLogo, color: 'from-gray-500 to-gray-600' }
]

const videoFormats = [
  { value: 'vertical-9-16', label: 'Vertical (9:16)', icon: '📱' },
  { value: 'horizontal-16-9', label: 'Horizontal (16:9)', icon: '🖥️' },
  { value: 'square-1-1', label: 'Square (1:1)', icon: '⬜' },
  { value: 'landscape-4-5', label: 'Landscape (4:5)', icon: '📐' }
]

// Avatar and voice options are now fetched from AI Video API via useAIVideo hook

export default function NewCampaignPage() {
  const router = useRouter()
  const { avatars, voices, loading: aiVideoLoading, playVoiceSample, generateVideo: aiVideoGenerateVideo } = useAIVideo()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    type: '',

    platforms: [] as string[],
    videoFormat: '',
    targetAudience: '',
    videoCount: '1',
    budget: '',
    startDate: '',
    endDate: '',
    hashtags: '',
    callToAction: '',
    product: '',
    script: '',
    selectedAvatar: '',
    selectedVoice: '',
    generationSettings: {
      duration: 30,
      quality: 'high',
      style: 'professional'
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const totalSteps = 7

  const nextStep = () => {
    console.log('Current step:', currentStep, 'Can proceed:', canProceedToNextStep())
    if (currentStep < totalSteps && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateScript = async () => {
    if (!formData.product || !formData.targetAudience) {
      alert('Please fill in product and target audience first')
      return
    }

    setIsGeneratingScript(true)
    try {
      // Simulate AI script generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedScript = `🎯 **Hook (0-5s):**
"Hey there! Ever struggled with ${formData.product}? You're not alone!"

💡 **Problem (5-15s):**
"Most people think ${formData.product} is complicated or expensive. But what if I told you there's a better way?"

✨ **Solution (15-25s):**
"With our ${formData.product}, you get amazing results without the hassle. Perfect for ${formData.targetAudience} who want quality and simplicity."

🚀 **CTA (25-30s):**
"Ready to transform your experience? Try ${formData.product} today and see the difference!"

**Tone:** Friendly, relatable, solution-focused
**Pace:** Builds from problem to solution
**Key Words:** Transform, results, simple, quality`

      setFormData(prev => ({ ...prev, script: generatedScript }))
    } catch (error) {
      console.error('Error generating script:', error)
      alert('Failed to generate script. Please try again.')
    } finally {
      setIsGeneratingScript(false)
    }
  }

  const generateVideo = async () => {
    if (!formData.script || !formData.selectedAvatar || !formData.selectedVoice) {
      alert('Please complete script, avatar, and voice selection')
      return
    }

    setIsGeneratingVideo(true)
    try {
      console.log('🎬 Starting video generation...')
      console.log('📝 Script:', formData.script.substring(0, 100) + '...')
      console.log('👤 Avatar ID:', formData.selectedAvatar)
      console.log('🎤 Voice ID:', formData.selectedVoice)
      console.log('⚙️ Settings:', formData.generationSettings)

      // Use AI Video service to generate video
      const result = await aiVideoGenerateVideo({
        script: formData.script,
        avatarId: formData.selectedAvatar,
        voiceId: formData.selectedVoice,
        settings: {
          duration: formData.generationSettings.duration,
          quality: formData.generationSettings.quality,
          style: formData.generationSettings.style
        }
      })

      console.log('✅ AI Video generation started successfully:', result)
      setGeneratedVideo({ jobId: result.jobId, status: result.status })
      
      // Show success message with job ID
      alert(`Video generation started successfully!\n\nJob ID: ${result.jobId}\nStatus: ${result.status}\n\nYou can now proceed to the next step.`)
      nextStep()
    } catch (error) {
      console.error('❌ Error generating video with AI Video service:', error)
      alert(`Failed to start video generation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || formData.platforms.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          platforms: formData.platforms,
          videoFormat: formData.videoFormat,
          targetAudience: formData.targetAudience,
          budget: parseFloat(formData.budget) || 0,
  
          hashtags: formData.hashtags,
          callToAction: formData.callToAction,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Campaign created successfully!')
        router.push('/dashboard/campaigns')
      } else {
        alert(`Error: ${data.message || 'Failed to create campaign'}`)
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Campaign Setup
        return formData.name.trim() !== '' && formData.type !== ''
      case 2: // Product & Platform
        return formData.product.trim() !== '' && 
               formData.targetAudience.trim() !== '' && 
               formData.platforms.length > 0 && 
               formData.videoFormat !== ''
      case 3: // AI Script
        return formData.script.trim() !== ''
      case 4: // Avatar & Voice
        return formData.selectedAvatar !== '' && formData.selectedVoice !== ''
      case 5: // Generate Video
        return true // Can always proceed to next step
      case 6: // Preview & Edit
        return true // Can always proceed to next step
      default:
        return false
    }
  }

  const getStepRequirements = () => {
    switch (currentStep) {
      case 1:
        return ['Campaign name', 'Campaign type']
      case 2:
        return ['Product/service', 'Target audience', 'Platforms', 'Video format']
      case 3:
        return ['Video script (AI generated or manual)']
      case 4:
        return ['AI avatar selection', 'AI voice selection']
      case 5:
        return ['Ready to generate video']
      case 6:
        return ['Video processing']
      case 7:
        return ['Ready to publish']
      default:
        return []
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
    <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Campaign Setup</h3>
            
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
                
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>


          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Product & Platform Selection</h3>
            
            {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service *
            </label>
              <input
                type="text"
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="e.g., AI Automation Tool, Fitness App, Beauty Product"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Busy professionals aged 25-40, Fitness enthusiasts, Small business owners"
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
                    <platform.icon className="w-5 h-5" />
                    <span>{platform.label}</span>
                  </div>

                </button>
              ))}
            </div>
          </div>

            {/* Video Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video Format *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {videoFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.videoFormat === format.value
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
              <input
                      type="radio"
                      name="videoFormat"
                      value={format.value}
                      checked={formData.videoFormat === format.value}
                      onChange={(e) => setFormData({ ...formData, videoFormat: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{format.label}</p>
    
            </div>
          </div>
              </label>
                ))}
            </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">AI Script Generation</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-medium text-blue-900">AI-Powered Script Creation</h4>
            </div>
              <p className="text-blue-800 mb-4">
                Our AI will analyze your product and target audience to create engaging, conversion-focused video scripts.
              </p>
              
              <button
                onClick={generateScript}
                disabled={isGeneratingScript || !formData.product || !formData.targetAudience}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Script
                  </>
                )}
              </button>
            </div>

            {/* Manual Script Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Script (AI Generated or Manual)
              </label>
              <textarea
                value={formData.script}
                onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                placeholder="Your video script will appear here after AI generation, or you can write it manually..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{formData.script.length} characters</span>
                <span>Estimated duration: {Math.ceil(formData.script.length / 150)}s</span>
            </div>
          </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Avatar & Voice Selection</h3>
            
            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select AI Avatar *
              </label>
                                <AvatarSelector
                    avatars={avatars}
                    selectedAvatar={formData.selectedAvatar}
                    onAvatarSelect={(avatarId) => setFormData({ ...formData, selectedAvatar: avatarId })}
                    loading={aiVideoLoading}
              />
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select AI Voice *
              </label>
                                <VoiceSelector
                    voices={voices}
                    selectedVoice={formData.selectedVoice}
                    onVoiceSelect={(voiceId) => setFormData({ ...formData, selectedVoice: voiceId })}
                    onPlaySample={playVoiceSample}
                    loading={aiVideoLoading}
                  />
          </div>

            {/* Generation Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video Generation Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration (seconds)</label>
                  <select
                    value={formData.generationSettings.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      generationSettings: {
                        ...formData.generationSettings,
                        duration: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                  </select>
          </div>
          <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quality</label>
                  <select
                    value={formData.generationSettings.quality}
                    onChange={(e) => setFormData({
                      ...formData,
                      generationSettings: {
                        ...formData.generationSettings,
                        quality: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                    <option value="premium">Premium</option>
                  </select>
          </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Style</label>
                  <select
                    value={formData.generationSettings.style}
                    onChange={(e) => setFormData({
                      ...formData,
                      generationSettings: {
                        ...formData.generationSettings,
                        style: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="casual">Casual</option>
                    <option value="professional">Professional</option>
                    <option value="energetic">Energetic</option>
                    <option value="calm">Calm</option>
                  </select>
          </div>
        </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Generate Video</h3>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <Video className="w-6 h-6 text-green-600" />
                <h4 className="text-lg font-medium text-green-900">Ready to Generate Your Video</h4>
                  </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Script: {formData.script ? '✅ Ready' : '❌ Missing'}</span>
                    </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Avatar: {formData.selectedAvatar ? '✅ Selected' : '❌ Missing'}</span>
                  </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Voice: {formData.selectedVoice ? '✅ Selected' : '❌ Missing'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Settings: ✅ Configured</span>
                </div>
                  </div>

              <button
                onClick={generateVideo}
                disabled={isGeneratingVideo || !formData.script || !formData.selectedAvatar || !formData.selectedVoice}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Video with HeyGen API
                  </>
                )}
              </button>
                          </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">What happens next?</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your script will be converted to speech using AI voices</li>
                <li>• HeyGen API will generate avatar video with lip-sync</li>
                <li>• Video will be optimized for your selected platforms</li>
                <li>• You'll receive a preview for review and editing</li>
              </ul>
                        </div>
                        </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Preview & Edit</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                      </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Video Generation in Progress</h4>
                <p className="text-gray-600 mb-4">Your video is being created. This may take a few minutes.</p>
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-500">Processing...</span>
                  </div>
                </div>
              </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Next Steps</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Wait for video generation to complete</li>
                <li>• Preview and edit your video if needed</li>
                <li>• Optimize for different platforms</li>
                <li>• Schedule or publish your content</li>
              </ul>
                    </div>
                  </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Publish & Schedule</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Video Ready!</h4>
                <p className="text-gray-600 mb-6">Your AI-generated video is ready for publishing.</p>
                
                <div className="flex items-center justify-center space-x-4">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Publish Now
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                    </button>
                  </div>
                        </div>
                      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Platform Optimization</h5>
                <div className="space-y-2">
                  {formData.platforms.map(platform => (
                    <div key={platform} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{platform}</span>
                        </div>
                  ))}
                    </div>
                  </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Analytics Tracking</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">View counts</span>
                        </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Engagement rates</span>
                        </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Conversion tracking</span>
                      </div>
                  </div>
                </div>
              </div>
          </div>
        )

      default:
        return null
    }
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
            <p className="text-gray-600 mt-1">Complete video generation workflow: Campaign → Script → Video → Publish</p>
                        </div>
                      </div>
                  </div>
                  
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                  </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
                          </div>
                        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Campaign Setup</span>
          <span>Product & Platform</span>
          <span>AI Script</span>
          <span>Avatar & Voice</span>
          <span>Generate Video</span>
          <span>Preview & Edit</span>
          <span>Publish</span>
                      </div>
                  </div>
                  
      {/* Step Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Step {currentStep} Requirements</h4>
                  </div>
        <div className="flex flex-wrap gap-2">
          {getStepRequirements().map((requirement, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {requirement}
            </span>
          ))}
                </div>
        <div className="mt-2 text-xs text-blue-700">
          <strong>Debug:</strong> Can proceed: {canProceedToNextStep() ? 'Yes' : 'No'} | 
          Current step: {currentStep} | 
          Total steps: {totalSteps}
              </div>
            </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
                  </button>

        <div className="flex items-center space-x-3">
          {currentStep === totalSteps ? (
                    <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Campaign & Publish Video
                </>
              )}
                    </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          )}
                  </div>
                </div>
    </div>
  )
}
