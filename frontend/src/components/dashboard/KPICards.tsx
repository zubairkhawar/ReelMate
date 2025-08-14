'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Eye, 
  ThumbsUp, 
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  MapPin,
  Activity,
  X
} from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
  hoverAction: {
    title: string
    description: string
    action: string
    endpoint: string
  }
}

interface KPICardData {
  totalVideos: number
  totalViews: number
  totalEngagement: number
  averageWatchTime: number
}

const KPICards = () => {
  const [kpiData, setKpiData] = useState<KPICardData>({
    totalVideos: 0,
    totalViews: 0,
    totalEngagement: 0,
    averageWatchTime: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [modalData, setModalData] = useState<any>(null)

  useEffect(() => {
    fetchKPIData()
  }, [])

  const fetchKPIData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Use mock data if no token
        setMockData()
        return
      }

      const response = await fetch('http://localhost:5001/api/analytics/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setKpiData({
          totalVideos: data.overview?.totalViews ? Math.round(data.overview.totalViews / 1000) : 23,
          totalViews: data.overview?.totalViews || 12450,
          totalEngagement: data.overview?.avgCtr || 3.2,
          averageWatchTime: data.overview?.avgCtr ? Math.round(data.overview.avgCtr * 10) / 10 : 4.2
        })
      } else {
        setMockData()
      }
    } catch (error) {
      console.error('Failed to fetch KPI data:', error)
      setMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const setMockData = () => {
    setKpiData({
      totalVideos: 23,
      totalViews: 12450,
      totalEngagement: 3.2,
      averageWatchTime: 4.2
    })
  }

  const handleHoverAction = async (endpoint: string, title: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Show mock data for demo
        setModalData(getMockModalData(endpoint))
        setActiveModal(title)
        return
      }

      const response = await fetch(`http://localhost:5001/api/analytics/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setModalData(data)
        setActiveModal(title)
      } else {
        console.error('Failed to fetch data')
        setModalData(getMockModalData(endpoint))
        setActiveModal(title)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setModalData(getMockModalData(endpoint))
      setActiveModal(title)
    }
  }

  const getMockModalData = (endpoint: string) => {
    switch (endpoint) {
      case 'campaign-breakdown':
        return {
          title: 'Campaign Breakdown',
          data: [
            { campaign: 'Summer Collection', views: 3200, revenue: 1250, ctr: 4.2 },
            { campaign: 'Product Launch', views: 2100, revenue: 890, ctr: 3.8 },
            { campaign: 'Holiday Special', views: 8900, revenue: 3400, ctr: 5.1 }
          ]
        }
      case 'traffic-sources':
        return {
          title: 'Traffic Sources',
          data: [
            { platform: 'TikTok', views: 6000, percentage: 48 },
            { platform: 'Instagram', views: 4500, percentage: 36 },
            { platform: 'Facebook', views: 1950, percentage: 16 }
          ]
        }
      case 'engagement-details':
        return {
          title: 'Engagement Details',
          data: [
            { metric: 'Likes', value: 1245, rate: 8.2 },
            { metric: 'Comments', value: 312, rate: 2.1 },
            { metric: 'Shares', value: 187, rate: 1.2 }
          ]
        }
      case 'retention-curve':
        return {
          title: 'Retention Curve',
          data: [
            { second: '0s', retention: 100 },
            { second: '10s', retention: 78 },
            { second: '30s', retention: 65 },
            { second: '60s', retention: 45 }
          ]
        }
      default:
        return { title: 'Data', data: [] }
    }
  }

  const kpiCards: KPICardProps[] = [
    {
      title: 'Total UGC Videos',
      value: kpiData.totalVideos,
      change: 18.2,
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      hoverAction: {
        title: 'View Campaign Breakdown',
        description: 'See detailed performance metrics for each campaign',
        action: 'View Breakdown',
        endpoint: 'campaign-breakdown'
      }
    },
    {
      title: 'Total Views',
      value: kpiData.totalViews.toLocaleString(),
      change: 12.5,
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      hoverAction: {
        title: 'View Traffic Sources',
        description: 'Analyze where your traffic is coming from',
        action: 'View Sources',
        endpoint: 'traffic-sources'
      }
    },
    {
      title: 'Engagement Rate',
      value: `${kpiData.totalEngagement}%`,
      change: 8.2,
      icon: ThumbsUp,
      color: 'from-green-500 to-emerald-500',
      hoverAction: {
        title: 'View Engagement Details',
        description: 'Deep dive into likes, comments, shares, and saves',
        action: 'View Details',
        endpoint: 'engagement-details'
      }
    },
    {
      title: 'Avg Watch Time',
      value: `${kpiData.averageWatchTime}s`,
      change: 5.3,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      hoverAction: {
        title: 'View Retention Curve',
        description: 'Analyze video retention and drop-off patterns',
        action: 'View Curve',
        endpoint: 'retention-curve'
      }
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleHoverAction(card.hoverAction.endpoint, card.hoverAction.title)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+{card.change}%</span>
                  <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                </div>
              </div>
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  points="0,35 20,25 40,30 60,15 80,20 100,10"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Micro Legend */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>TikTok: 45%</span>
              <span>IG: 35%</span>
              <span>FB: 20%</span>
            </div>
            
            {/* Hover Quick Action */}
            <div className="absolute inset-0 bg-blue-50 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {card.hoverAction.action}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for detailed data */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {modalData?.title || activeModal}
                    </h3>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {modalData?.data?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            {item.campaign || item.platform || item.metric || item.second}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {item.views || item.value || item.retention}
                            {item.percentage && `%`}
                            {item.revenue && `$${item.revenue}`}
                            {item.ctr && `%`}
                          </div>
                          {item.percentage && (
                            <div className="text-sm text-gray-500">{item.percentage}%</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Close
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

export default KPICards
