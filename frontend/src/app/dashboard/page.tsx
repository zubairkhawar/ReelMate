'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Video, 
  Plus,
  Play,
  BarChart3,
  Users,
  Target,
  ShoppingCart,
  Calendar,
  Filter,
  MoreVertical,
  Sparkles,
  Clock,
  ThumbsUp,
  Share2
} from 'lucide-react'
import Link from 'next/link'

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

interface PerformanceData {
  views: number[]
  engagement: number[]
  watchTime: number[]
  shares: number[]
  labels: string[]
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
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    views: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
    engagement: [45, 78, 120, 180, 90, 140, 200],
    watchTime: [3.75, 4.11, 4.0, 3.6, 4.5, 4.67, 5.0],
    shares: [120, 180, 300, 450, 200, 320, 480],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  })
  const [activeTab, setActiveTab] = useState('views')
  const [dateRange, setDateRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/analytics/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentCampaigns(data.recentCampaigns || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Set mock data for UGC video platform
      setStats({
        totalVideos: 23,
        totalViews: 12450,
        totalEngagement: 3420,
        averageWatchTime: 4.2,
        activeCampaigns: 5
      })
      setRecentCampaigns([
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
          name: 'Holiday UGC Challenge',
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
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢'
      case 'paused':
        return '🟡'
      case 'completed':
        return '🔵'
      case 'processing':
        return '🟣'
      default:
        return '⚪'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵'
      case 'instagram':
        return '📷'
      case 'youtube':
        return '▶️'
      case 'facebook':
        return '📘'
      default:
        return '🌐'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50
          return (
            <div
              key={index}
              className="w-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
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
          Create UGC Campaign
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Primary Metric Card - Total Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total UGC Videos</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalVideos)}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Inline Sparkline */}
          <div className="mb-4">
            {renderSparkline(performanceData.views)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18.2%
            </div>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
        </motion.div>

        {/* Secondary Metric Cards */}
        {[
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-blue-500 to-blue-600', trend: '+12.5%' },
          { label: 'Engagement Rate', value: `${((stats.totalEngagement / stats.totalViews) * 100).toFixed(1)}%`, icon: ThumbsUp, color: 'from-green-500 to-green-600', trend: '+8.2%' },
          { label: 'Avg Watch Time', value: `${stats.averageWatchTime}s`, icon: Clock, color: 'from-orange-500 to-orange-600', trend: '+5.3%' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              {metric.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* UGC Video Performance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">UGC Video Performance</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Last 7 days</span>
          </div>
        </div>
        
        {/* Performance Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {['Views', 'Engagement', 'Watch Time', 'Shares'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                tab === 'Views'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Chart Visualization */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Chart visualization for {performanceData.views} data</p>
          <p className="text-gray-500 text-xs mt-1">Last 7 days</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/campaigns/new"
            className="group p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create UGC Campaign</h4>
                <p className="text-sm text-gray-500">Start a new UGC video campaign</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/ai-studio"
            className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AI Video Generator</h4>
                <p className="text-sm text-gray-500">Create videos with AI assistance</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="group p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-500">Check video performance metrics</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent UGC Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent UGC Campaigns</h3>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-500 hover:text-gray-700">Filter</button>
            <Link href="/dashboard/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">
                    Created {campaign.createdAt} • {campaign.videoCount} videos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {getStatusIcon(campaign.status)} {campaign.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {getPlatformIcon(campaign.platform)} {campaign.platform}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{campaign.totalViews} views</p>
                  <p className="text-xs text-gray-500">{campaign.watchTime}s avg watch</p>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

