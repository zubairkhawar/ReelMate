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
  Share2,
  Search,
  Copy,
  Download,
  Pause,
  Trash2
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
  ]

  const setMockData = () => {
    setStats(getDefaultStats())
    setRecentCampaigns(getDefaultCampaigns())
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

  if (isLoading || !stats) {
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

      {/* Time Range & Comparison Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">vs</span>
              <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200">
                Previous Period
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="today">Today</option>
              <option value="7d" selected>Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total UGC Videos */}
          <div className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total UGC Videos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalVideos || 0}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+18.2%</span>
                  <svg className="w-4 h-4 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="url(#purple-gradient)"
                  strokeWidth="2"
                  points="0,35 20,25 40,30 60,15 80,20 100,10"
                />
                <defs>
                  <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                View Campaign Breakdown
              </button>
            </div>
          </div>

          {/* Total Views */}
          <div className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(stats?.totalViews || 0).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  <svg className="w-4 h-4 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  points="0,30 20,20 40,25 60,10 80,15 100,5"
                />
              </svg>
            </div>
            
            {/* Micro Legend */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>TikTok: 60%</span>
              <span>IG: 25%</span>
              <span>FB: 15%</span>
            </div>
            
            {/* Hover Quick Action */}
            <div className="absolute inset-0 bg-blue-50 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                View Traffic Sources
              </button>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalEngagement || 0}%</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+8.2%</span>
                  <svg className="w-4 h-4 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  points="0,25 20,20 40,15 60,10 80,5 100,0"
                />
              </svg>
            </div>
            
            {/* Micro Legend */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>TikTok: 55%</span>
              <span>IG: 30%</span>
              <span>FB: 15%</span>
            </div>
            
            {/* Hover Quick Action */}
            <div className="absolute inset-0 bg-green-50 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                View Engagement Details
              </button>
            </div>
          </div>

          {/* Avg Watch Time */}
          <div className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Watch Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.averageWatchTime || 0}s</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+5.3%</span>
                  <svg className="w-4 h-4 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="h-12 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  points="0,20 20,25 40,20 60,15 80,20 100,15"
                />
              </svg>
            </div>
            
            {/* Micro Legend */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>TikTok: 40%</span>
              <span>IG: 45%</span>
              <span>FB: 15%</span>
            </div>
            
            {/* Hover Quick Action */}
            <div className="absolute inset-0 bg-orange-50 bg-opacity-90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200">
                View Retention Curve
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Campaign Playbook
            </button>
            <div className="relative group">
              <button className="w-5 h-5 text-gray-400 hover:text-gray-600 rounded-full border border-gray-300 flex items-center justify-center">
                ?
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <p>One-sheet with best-performing templates and proven strategies for UGC campaigns</p>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
        
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
        
        {/* Contextual CTA for New Users */}
        {recentCampaigns.length === 0 && (
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

      {/* Enhanced Recent Campaigns */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent UGC Campaigns</h3>
          <Link href="/dashboard/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
            </select>
            
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Platforms</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
        
        {/* Campaigns List */}
        <div className="space-y-3">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              {/* Left: Campaign Info */}
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
              
              {/* Middle: Platform & Status */}
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)} {campaign.status}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {getPlatformIcon(campaign.platform)} {campaign.platform}
                </span>
              </div>
              
              {/* Right: KPI Snapshot & Actions */}
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{campaign.totalViews} views</p>
                  <p className="text-xs text-gray-500">{campaign.watchTime}s avg watch</p>
                </div>
                
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Eye className="w-4 h-4 mr-3 text-gray-400" />
                      View
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Copy className="w-4 h-4 mr-3 text-gray-400" />
                      Duplicate
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Download className="w-4 h-4 mr-3 text-gray-400" />
                      Export
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Pause className="w-4 h-4 mr-3 text-gray-400" />
                      Pause
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

