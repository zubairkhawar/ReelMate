'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Video, 
  ShoppingCart, 
  Bot, 
  Mic, 
  Palette, 
  Target,
  Play,
  Plus,
  Upload,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface CampaignForm {
  name: string
  productId: string
  targetPlatforms: string[]
  videoLength: string
  avatarStyle: string
  voiceStyle: string
  scriptTone: string
  hookStyle: string
  callToAction: string
}

const avatarStyles = [
  { id: 'friendly', name: 'Friendly & Approachable', description: 'Warm, trustworthy personality' },
  { id: 'professional', name: 'Professional & Confident', description: 'Business-like, authoritative' },
  { id: 'energetic', name: 'Energetic & Exciting', description: 'High-energy, enthusiastic' },
  { id: 'casual', name: 'Casual & Relatable', description: 'Everyday, down-to-earth' }
]

const voiceStyles = [
  { id: 'female-warm', name: 'Female - Warm & Friendly', description: 'Gentle, approachable tone' },
  { id: 'female-energetic', name: 'Female - Energetic', description: 'High-energy, exciting' },
  { id: 'male-confident', name: 'Male - Confident', description: 'Strong, authoritative' },
  { id: 'male-casual', name: 'Male - Casual', description: 'Relaxed, conversational' }
]

const scriptTones = [
  { id: 'problem-solution', name: 'Problem-Solution', description: 'Identify pain point, offer solution' },
  { id: 'storytelling', name: 'Storytelling', description: 'Narrative approach with emotional hook' },
  { id: 'benefit-focused', name: 'Benefit-Focused', description: 'Highlight key benefits and features' },
  { id: 'social-proof', name: 'Social Proof', description: 'Customer testimonials and results' }
]

const hookStyles = [
  { id: 'question', name: 'Question Hook', description: 'Start with engaging question' },
  { id: 'statistic', name: 'Statistic Hook', description: 'Lead with surprising number' },
  { id: 'story', name: 'Story Hook', description: 'Begin with relatable scenario' },
  { id: 'controversy', name: 'Controversy Hook', description: 'Challenge common belief' }
]

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: '/api/placeholder/100/100',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 299.99,
    image: '/api/placeholder/100/100',
    description: 'Advanced fitness tracking with health monitoring'
  }
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    productId: '',
    targetPlatforms: [],
    videoLength: '30',
    avatarStyle: 'friendly',
    voiceStyle: 'female-warm',
    scriptTone: 'problem-solution',
    hookStyle: 'question',
    callToAction: 'Shop Now'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [previewData, setPreviewData] = useState<any>(null)

  const handleInputChange = (field: keyof CampaignForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter(p => p !== platform)
        : [...prev.targetPlatforms, platform]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/ugc/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard/campaigns/${data.campaign.id}`)
      } else {
        console.error('Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePreview = async () => {
    setIsLoading(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPreviewData({
        script: `Hey there! Are you tired of [problem]? I was too, until I discovered this amazing [product] that completely changed my [area of life]. 

The best part? It's so easy to use and the results are incredible! I can't believe I waited so long to try it.

If you're ready to [benefit], click the link below and start your transformation today!`,
        estimatedDuration: '28 seconds',
        hook: 'Question-based hook to engage viewers',
        cta: formData.callToAction
      })
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Campaign Details', description: 'Basic campaign information' },
    { number: 2, title: 'AI Configuration', description: 'Avatar, voice, and script settings' },
    { number: 3, title: 'Preview & Generate', description: 'Review and create your campaign' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/campaigns"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="text-gray-600 mt-1">Generate AI-powered UGC videos for your products</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.number ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Campaign Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Campaign Details</h2>
            
            <div className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Summer Sale Campaign"
                  required
                />
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.productId === product.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('productId', product.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['TikTok', 'Instagram', 'Facebook', 'YouTube'].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformToggle(platform)}
                      className={`p-3 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.targetPlatforms.includes(platform)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Length
                </label>
                <select
                  value={formData.videoLength}
                  onChange={(e) => handleInputChange('videoLength', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Configuration */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Configuration</h2>
            
            <div className="space-y-6">
              {/* Avatar Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  AI Avatar Style
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {avatarStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.avatarStyle === style.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('avatarStyle', style.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{style.name}</p>
                          <p className="text-sm text-gray-500">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Voice Style
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {voiceStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.voiceStyle === style.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-blue-500 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('voiceStyle', style.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mic className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{style.name}</p>
                          <p className="text-sm text-gray-500">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Script Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Script Tone
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scriptTones.map((tone) => (
                    <div
                      key={tone.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.scriptTone === tone.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('scriptTone', tone.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Palette className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tone.name}</p>
                          <p className="text-sm text-gray-500">{tone.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hook Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hook Style
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hookStyles.map((hook) => (
                    <div
                      key={hook.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.hookStyle === hook.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('hookStyle', hook.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{hook.name}</p>
                          <p className="text-sm text-gray-500">{hook.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={formData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Shop Now, Learn More, Get Started"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview & Generate */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview & Generate</h2>
            
            <div className="space-y-6">
              {/* Campaign Summary */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-3">Campaign Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Video Length</p>
                    <p className="font-medium">{formData.videoLength} seconds</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Platforms</p>
                    <p className="font-medium">{formData.targetPlatforms.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avatar Style</p>
                    <p className="font-medium">{avatarStyles.find(s => s.id === formData.avatarStyle)?.name}</p>
                  </div>
                </div>
              </div>

              {/* AI Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">AI-Generated Script Preview</h3>
                  <button
                    type="button"
                    onClick={generatePreview}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isLoading ? 'Generating...' : 'Generate Preview'}
                  </button>
                </div>

                {previewData ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Generated Script:</p>
                        <p className="text-sm text-blue-800 whitespace-pre-line">{previewData.script}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-blue-700">
                        <span>Duration: {previewData.estimatedDuration}</span>
                        <span>Hook: {previewData.hook}</span>
                        <span>CTA: {previewData.cta}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Click "Generate Preview" to see your AI-generated script</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !previewData}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Campaign...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Create Campaign</span>
                </div>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
