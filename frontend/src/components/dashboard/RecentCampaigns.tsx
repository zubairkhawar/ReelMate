'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Filter,
  MoreVertical,
  Eye,
  Copy,
  Download,
  Pause,
  Trash2,
  Video,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'processing'
  videoCount: number
  totalViews: number
  engagement: number
  watchTime: number
  createdAt: string
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
}

interface RecentCampaignsProps {
  campaigns: Campaign[]
}

const RecentCampaigns = ({ campaigns }: RecentCampaignsProps) => {
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(campaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [showFilters, setShowFilters] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    filterCampaigns()
  }, [searchTerm, statusFilter, platformFilter, dateRange, campaigns])

  const filterCampaigns = () => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter
      
      let matchesDate = true
      if (dateRange !== 'all') {
        const campaignDate = new Date(campaign.createdAt)
        const now = new Date()
        let startDate: Date
        
        switch (dateRange) {
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
          default:
            startDate = new Date(0)
        }
        
        matchesDate = campaignDate >= startDate
      }
      
      return matchesSearch && matchesStatus && matchesPlatform && matchesDate
    })
    
    setFilteredCampaigns(filtered)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCampaignAction = async (action: string, campaignId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(`Mock action: ${action} for campaign ${campaignId}`)
        return
      }

      const response = await fetch(`http://localhost:5001/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: action === 'pause' ? 'paused' : action === 'activate' ? 'active' : undefined
        })
      })

      if (response.ok) {
        console.log(`Campaign ${action} successful`)
        // Refresh campaigns or update local state
      }
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error)
    }
    
    setActiveDropdown(null)
  }

  const handleBulkAction = async (action: string, campaignIds: string[]) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(`Mock bulk action: ${action} for campaigns`, campaignIds)
        return
      }

      const response = await fetch('http://localhost:5001/api/campaigns/bulk-actions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          campaignIds
        })
      })

      if (response.ok) {
        console.log(`Bulk ${action} successful`)
        // Refresh campaigns or update local state
      }
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error)
    }
  }

  return (
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Platforms</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Campaigns List */}
      <div className="space-y-3">
        {filteredCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Left: Campaign Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                <p className="text-sm text-gray-500">
                  Created {formatDate(campaign.createdAt)} • {campaign.videoCount} videos
                </p>
              </div>
            </div>
            
            {/* Middle: Platform & Status */}
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
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
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  onClick={() => setActiveDropdown(activeDropdown === campaign.id ? null : campaign.id)}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === campaign.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <button 
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleCampaignAction('view', campaign.id)}
                      >
                        <Eye className="w-4 h-4 mr-3 text-gray-400" />
                        View
                      </button>
                      <button 
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleCampaignAction('duplicate', campaign.id)}
                      >
                        <Copy className="w-4 h-4 mr-3 text-gray-400" />
                        Duplicate
                      </button>
                      <button 
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleCampaignAction('export', campaign.id)}
                      >
                        <Download className="w-4 h-4 mr-3 text-gray-400" />
                        Export
                      </button>
                      {campaign.status === 'active' ? (
                        <button 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => handleCampaignAction('pause', campaign.id)}
                        >
                          <Pause className="w-4 h-4 mr-3 text-gray-400" />
                          Pause
                        </button>
                      ) : (
                        <button 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => handleCampaignAction('activate', campaign.id)}
                        >
                          <Video className="w-4 h-4 mr-3 text-gray-400" />
                          Activate
                        </button>
                      )}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button 
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        onClick={() => handleCampaignAction('delete', campaign.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h4>
          <p className="text-gray-600 text-sm mb-4">
            {searchTerm || statusFilter !== 'all' || platformFilter !== 'all' || dateRange !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Create your first campaign to get started'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && platformFilter === 'all' && dateRange === 'all' && (
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Video className="w-4 h-4 mr-2" />
              Create Campaign
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default RecentCampaigns
