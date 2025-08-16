'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Mail,
  MessageSquare,
  Share2,
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Check,
  Copy,
  Trash2,
  Download,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Video,
  Sparkles,
  Target,
  ThumbsUp
} from 'lucide-react'
import { 
  TikTokLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  FacebookLogo, 
  MultiPlatformLogo 
} from '../../../components/logos'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
  thumbnail: string
  type: 'ugc-video' | 'ai-generated' | 'user-submitted' | 'branded-content'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'processing'
  videoCount: number
  totalViews: number
  engagement: number
  watchTime: number
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'multi-platform'
  createdAt: string
  targetAudience: string
  budget: number
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Collection UGC Challenge',
    thumbnail: '/api/placeholder/60/40',
    type: 'ugc-video',
    status: 'active',
    videoCount: 8,
    totalViews: 3200,
    engagement: 89,
    watchTime: 4.2,
    platform: 'tiktok',
    createdAt: '2024-01-15',
    targetAudience: 'Fashion enthusiasts, 18-35',
    budget: 2500
  },
  {
    id: '2',
    name: 'Product Launch UGC Series',
    thumbnail: '/api/placeholder/60/40',
    type: 'ai-generated',
    status: 'scheduled',
    videoCount: 12,
    totalViews: 2100,
    engagement: 67,
    watchTime: 3.8,
    platform: 'instagram',
    createdAt: '2024-01-12',
    targetAudience: 'Tech-savvy consumers, 25-45',
    budget: 3500
  },
  {
    id: '3',
    name: 'Holiday UGC Campaign',
    thumbnail: '/api/placeholder/60/40',
    type: 'user-submitted',
    status: 'completed',
    videoCount: 15,
    totalViews: 8900,
    engagement: 234,
    watchTime: 4.5,
    platform: 'multi-platform',
    createdAt: '2024-01-08',
    targetAudience: 'General audience, all ages',
    budget: 5000
  },
  {
    id: '4',
    name: 'Brand Story UGC Series',
    thumbnail: '/api/placeholder/60/40',
    type: 'branded-content',
    status: 'processing',
    videoCount: 6,
    totalViews: 0,
    engagement: 0,
    watchTime: 0,
    platform: 'youtube',
    createdAt: '2024-01-14',
    targetAudience: 'Brand loyalists, 30-50',
    budget: 4000
  }
]

const typeConfig = {
  'ugc-video': { label: 'UGC Video', icon: Video, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'ai-generated': { label: 'AI Generated', icon: Sparkles, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'user-submitted': { label: 'User Submitted', icon: Users, color: 'bg-green-100 text-green-800 border-green-200' },
  'branded-content': { label: 'Branded Content', icon: Target, color: 'bg-orange-100 text-orange-800 border-orange-200' }
}

const statusConfig = {
  draft: { label: 'Draft', icon: AlertCircle, color: 'bg-gray-100 text-gray-800 border-gray-200' },
  scheduled: { label: 'Scheduled', icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  active: { label: 'Active', icon: Play, color: 'bg-green-100 text-green-800 border-green-200' },
  paused: { label: 'Paused', icon: Pause, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  processing: { label: 'Processing', icon: Clock, color: 'bg-purple-100 text-purple-800 border-purple-200' }
}

const platformConfig = {
  tiktok: { label: 'TikTok', icon: TikTokLogo, color: 'bg-black text-white border-black' },
  instagram: { label: 'Instagram', icon: InstagramLogo, color: 'bg-pink-100 text-pink-800 border-pink-200' },
  youtube: { label: 'YouTube', icon: YouTubeLogo, color: 'bg-red-100 text-red-800 border-red-200' },
  facebook: { label: 'Facebook', icon: FacebookLogo, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'multi-platform': { label: 'Multi-Platform', icon: MultiPlatformLogo, color: 'bg-gray-100 text-gray-800 border-gray-200' }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    filterCampaigns()
  }, [searchTerm, statusFilter, typeFilter, platformFilter, dateRange, campaigns])

  const filterCampaigns = () => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter
      const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesPlatform
    })
    
    setFilteredCampaigns(filtered)
    setCurrentPage(1)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id))
    } else {
      setSelectedCampaigns([])
    }
  }

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(prev => [...prev, campaignId])
    } else {
      setSelectedCampaigns(prev => prev.filter(id => id !== campaignId))
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        setCampaigns(prev => prev.filter(c => !selectedCampaigns.includes(c.id)))
        setSelectedCampaigns([])
        break
      case 'duplicate':
        // Implement duplicate logic
        break
      case 'export':
        // Implement export logic
        break
    }
  }

  const getTypeIcon = (type: string) => {
    const config = typeConfig[type as keyof typeof typeConfig]
    return config ? <config.icon className="w-3 h-3" /> : null
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return config ? <config.icon className="w-3 h-3" /> : null
  }

  const getPlatformIcon = (platform: string) => {
    const config = platformConfig[platform as keyof typeof platformConfig]
    if (config && config.icon) {
      const IconComponent = config.icon
      return <IconComponent className="w-4 h-4" />
    }
    return <MultiPlatformLogo className="w-4 h-4" />
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex)

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You haven't created any UGC campaigns yet
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            UGC campaigns help you create authentic, engaging video content with your audience. Start your first campaign to begin building meaningful connections.
          </p>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create your first UGC campaign
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">UGC Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage your User Generated Content video campaigns and track performance</p>
          </div>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create UGC Campaign
          </Link>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search UGC campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors duration-200 ${
              showFilters 
                ? 'border-purple-300 bg-purple-50 text-purple-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters && <X className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="ugc-video">UGC Video</option>
                    <option value="ai-generated">AI Generated</option>
                    <option value="user-submitted">User Submitted</option>
                    <option value="branded-content">Branded Content</option>
                  </select>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Platforms</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="multi-platform">Multi-Platform</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-purple-50 border border-purple-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-purple-900">
                  {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedCampaigns([])}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('duplicate')}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCampaigns.map((campaign) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => handleSelectCampaign(campaign.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-xs text-gray-500">Created {formatDate(campaign.createdAt)}</p>
                        <p className="text-xs text-gray-400">{campaign.targetAudience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${typeConfig[campaign.type].color}`}>
                      {getTypeIcon(campaign.type)}
                      <span className="ml-1">{typeConfig[campaign.type].label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${statusConfig[campaign.status].color}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1">{statusConfig[campaign.status].label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${platformConfig[campaign.platform].color}`}>
                      <span className="mr-1">{getPlatformIcon(campaign.platform)}</span>
                      {platformConfig[campaign.platform].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{campaign.videoCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{formatNumber(campaign.totalViews)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{campaign.engagement}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCampaigns.length)} of {filteredCampaigns.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
