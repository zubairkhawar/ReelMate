'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Video } from 'lucide-react'
import Link from 'next/link'
import KPICards from '@/components/dashboard/KPICards'
import PerformanceControls from '@/components/dashboard/PerformanceControls'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentCampaigns from '@/components/dashboard/RecentCampaigns'

interface DashboardStats {
  totalVideos: number
  totalViews: number
  totalEngagement: number
  averageWatchTime: number
  activeCampaigns: number
}

interface RecentCampaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'processing'
  videoCount: number
  totalViews: number
  engagement: number
  watchTime: number
  createdAt: string
  thumbnail: string
  trend: number[]
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalViews: 0,
    totalEngagement: 0,
    averageWatchTime: 0,
    activeCampaigns: 5
  })
  const [recentCampaigns, setRecentCampaigns] = useState<RecentCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('views')
  const [compareEnabled, setCompareEnabled] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // If no token, use mock data immediately
      if (!token) {
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
        setStats(data.stats || getDefaultStats())
        setRecentCampaigns(data.recentCampaigns || getDefaultCampaigns())
      } else {
        // If API fails, use mock data
        setMockData()
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Use mock data on error
      setMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultStats = (): DashboardStats => ({
    totalVideos: 23,
    totalViews: 12450,
    totalEngagement: 3420,
    averageWatchTime: 4.2,
    activeCampaigns: 5
  })

  const getDefaultCampaigns = (): RecentCampaign[] => [
    {
      id: '1',
      name: 'Summer Collection UGC Campaign',
      status: 'active',
      videoCount: 8,
      totalViews: 3200,
      engagement: 89,
      watchTime: 4.2,
      createdAt: '2024-01-15',
      thumbnail: '/api/placeholder/60/40',
      trend: [120, 180, 200, 250, 300, 280, 320],
      platform: 'tiktok'
    },
    {
      id: '2',
      name: 'Product Launch UGC Series',
      status: 'active',
      videoCount: 12,
      totalViews: 2100,
      engagement: 67,
      watchTime: 3.8,
      createdAt: '2024-01-12',
      thumbnail: '/api/placeholder/60/40',
      trend: [80, 120, 150, 180, 200, 190, 210],
      platform: 'instagram'
    },
    {
      id: '3',
      name: 'Holiday UGC Campaign',
      status: 'completed',
      videoCount: 15,
      totalViews: 8900,
      engagement: 234,
      watchTime: 4.5,
      createdAt: '2024-01-08',
      thumbnail: '/api/placeholder/60/40',
      trend: [300, 450, 600, 800, 1000, 1200, 890],
      platform: 'youtube'
    }
  ]

  const setMockData = () => {
    setStats(getDefaultStats())
    setRecentCampaigns(getDefaultCampaigns())
  }

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    // Here you would typically refetch data with the new date range
    console.log('Date range changed to:', range)
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform)
    // Here you would typically refetch data with the new platform filter
    console.log('Platform changed to:', platform)
  }

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
    // Here you would typically refetch data with the new metric
    console.log('Metric changed to:', metric)
  }

  const handleCompareToggle = (enabled: boolean) => {
    setCompareEnabled(enabled)
    // Here you would typically refetch data with comparison enabled
    console.log('Comparison toggled:', enabled)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your UGC video campaigns.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Campaign
        </Link>
      </div>

      {/* Performance Controls */}
      <PerformanceControls
        onDateRangeChange={handleDateRangeChange}
        onPlatformChange={handlePlatformChange}
        onMetricChange={handleMetricChange}
        onCompareToggle={handleCompareToggle}
      />

      {/* Enhanced KPI Cards */}
      <KPICards />

      {/* Enhanced Chart Area */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
          <div className="flex items-center space-x-4">
            {/* Platform Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Platform:</span>
              <div className="flex space-x-1">
                {['TikTok', 'Instagram', 'Facebook'].map((platform) => (
                  <button
                    key={platform}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-200 ${
                      platform === 'TikTok'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Metric Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Metric:</span>
              <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="views">Views</option>
                <option value="ctr">CTR</option>
                <option value="conversion">Conversion Rate</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No data yet</h4>
            <p className="text-gray-600 text-sm mb-4">Generate your first video to see performance analytics and insights</p>
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              <Video className="w-4 h-4 mr-2" />
              Create Your First Video
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <QuickActions recentCampaignsCount={recentCampaigns.length} />

      {/* Enhanced Recent Campaigns */}
      <RecentCampaigns campaigns={recentCampaigns} />
    </div>
  )
}

