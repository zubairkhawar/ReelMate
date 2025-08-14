'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Sparkles, 
  BarChart3, 
  BookOpen, 
  HelpCircle,
  X,
  Download,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface QuickActionsProps {
  recentCampaignsCount: number
}

const QuickActions = ({ recentCampaignsCount }: QuickActionsProps) => {
  const [showPlaybook, setShowPlaybook] = useState(false)
  const [playbookData, setPlaybookData] = useState<any>(null)
  const [isLoadingPlaybook, setIsLoadingPlaybook] = useState(false)

  const fetchPlaybook = async () => {
    if (playbookData) {
      setShowPlaybook(true)
      return
    }

    setIsLoadingPlaybook(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Use mock data for demo
        setPlaybookData(getMockPlaybook())
        setShowPlaybook(true)
        return
      }

      const response = await fetch('http://localhost:5001/api/campaigns/playbook', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPlaybookData(data)
        setShowPlaybook(true)
      } else {
        setPlaybookData(getMockPlaybook())
        setShowPlaybook(true)
      }
    } catch (error) {
      console.error('Failed to fetch playbook:', error)
      setPlaybookData(getMockPlaybook())
      setShowPlaybook(true)
    } finally {
      setIsLoadingPlaybook(false)
    }
  }

  const getMockPlaybook = () => ({
    title: 'UGC Campaign Playbook',
    description: 'Proven strategies and best practices for successful UGC campaigns',
    sections: [
      {
        title: 'Campaign Setup',
        items: [
          {
            title: 'Define Clear Objectives',
            description: 'Set specific, measurable goals for your UGC campaign',
            tips: ['Increase brand awareness', 'Drive conversions', 'Build community']
          },
          {
            title: 'Target Audience Research',
            description: 'Understand your audience demographics and preferences',
            tips: ['Analyze existing customer data', 'Use social media insights', 'Conduct surveys']
          }
        ]
      },
      {
        title: 'Content Strategy',
        items: [
          {
            title: 'Content Guidelines',
            description: 'Provide clear guidelines for creators while allowing creativity',
            tips: ['Include brand elements naturally', 'Specify key messages', 'Set quality standards']
          },
          {
            title: 'Hook Creation',
            description: 'Create compelling opening moments to capture attention',
            tips: ['Start with a question', 'Show transformation', 'Use trending sounds']
          }
        ]
      }
    ],
    templates: [
      {
        name: 'Problem-Agitate-Solve',
        description: 'Identify a problem, agitate it, then present your solution',
        structure: ['Hook: Problem statement', 'Middle: Problem consequences', 'End: Solution presentation']
      },
      {
        name: 'Before/After',
        description: 'Show transformation or improvement using your product',
        structure: ['Hook: Before state', 'Middle: Process/Product use', 'End: After results']
      }
    ]
  })

  const quickActions = [
    {
      title: 'Create UGC Campaign',
      description: 'Start a new UGC video campaign',
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      href: '/dashboard/campaigns/new',
      action: 'Create Campaign'
    },
    {
      title: 'AI Video Generator',
      description: 'Create videos with AI assistance',
      icon: Sparkles,
      color: 'from-blue-500 to-purple-500',
      href: '/dashboard/ai-studio',
      action: 'Generate Video'
    },
    {
      title: 'View Analytics',
      description: 'Check video performance metrics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/analytics',
      action: 'View Analytics'
    }
  ]

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchPlaybook}
              disabled={isLoadingPlaybook}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Campaign Playbook</span>
            </button>
            <div className="relative group">
              <button className="w-5 h-5 text-gray-400 hover:text-gray-600 rounded-full border border-gray-300 flex items-center justify-center">
                <HelpCircle className="w-3 h-3" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <p>One-sheet with best-performing templates and proven strategies for UGC campaigns</p>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="group p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Contextual CTA for New Users */}
        {recentCampaignsCount === 0 && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to get started?</h4>
            <p className="text-gray-600 text-sm mb-4">Create your first UGC campaign and start generating engaging video content</p>
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              <Video className="w-5 h-5 mr-2" />
              Create Your First Campaign
            </Link>
          </div>
        )}
      </div>

      {/* Campaign Playbook Modal */}
      <AnimatePresence>
        {showPlaybook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setShowPlaybook(false)}
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {playbookData?.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {playbookData?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPlaybook(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {isLoadingPlaybook ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading playbook...</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Sections */}
                      {playbookData?.sections?.map((section: any, sectionIndex: number) => (
                        <div key={sectionIndex} className="border border-gray-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h4>
                          <div className="space-y-4">
                            {section.items?.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-2">{item.title}</h5>
                                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.tips?.map((tip: string, tipIndex: number) => (
                                    <span
                                      key={tipIndex}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {tip}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {/* Templates */}
                      {playbookData?.templates && (
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Templates</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {playbookData.templates.map((template: any, index: number) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                <div className="space-y-2">
                                  {template.structure?.map((step: string, stepIndex: number) => (
                                    <div key={stepIndex} className="flex items-center space-x-2 text-sm">
                                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                        {stepIndex + 1}
                                      </div>
                                      <span className="text-gray-700">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={() => setShowPlaybook(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default QuickActions
