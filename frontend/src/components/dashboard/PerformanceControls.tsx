'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  TrendingUp,
  Filter,
  BarChart3,
  Eye,
  MousePointer,
  ShoppingCart
} from 'lucide-react'
import { 
  TikTokLogo, 
  InstagramLogo, 
  FacebookLogo, 
  MultiPlatformLogo 
} from '../logos'

interface PerformanceControlsProps {
  onDateRangeChange: (range: string) => void
  onPlatformChange: (platform: string) => void
  onMetricChange: (metric: string) => void
  onCompareToggle: (enabled: boolean) => void
}

const PerformanceControls = ({
  onDateRangeChange,
  onPlatformChange,
  onMetricChange,
  onCompareToggle
}: PerformanceControlsProps) => {
  const [dateRange, setDateRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('views')
  const [compareEnabled, setCompareEnabled] = useState(false)

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    onDateRangeChange(range)
  }

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform)
    onPlatformChange(platform)
  }

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
    onMetricChange(metric)
  }

  const handleCompareToggle = (enabled: boolean) => {
    setCompareEnabled(enabled)
    onCompareToggle(enabled)
  }

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: MultiPlatformLogo },
    { id: 'tiktok', name: 'TikTok', icon: TikTokLogo },
    { id: 'instagram', name: 'Instagram', icon: InstagramLogo },
    { id: 'facebook', name: 'Facebook', icon: FacebookLogo }
  ]

  const metrics = [
    { id: 'views', name: 'Views', icon: Eye, description: 'Total video views' },
    { id: 'ctr', name: 'CTR', icon: MousePointer, description: 'Click-through rate' },
    { id: 'conversion', name: 'Conversion Rate', icon: ShoppingCart, description: 'Sales conversion rate' }
  ]

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: 'custom', name: 'Custom' }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">vs</span>
            <button 
              onClick={() => handleCompareToggle(!compareEnabled)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                compareEnabled
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              Previous Period
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select 
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Platform Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Platform:</span>
          <div className="flex space-x-1">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformChange(platform.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-200 ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">
                  <platform.icon className="w-4 h-4" />
                </span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Metric Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Metric:</span>
          <select 
            value={selectedMetric}
            onChange={(e) => handleMetricChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {metrics.map(metric => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedMetric === metric.id
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => handleMetricChange(metric.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedMetric === metric.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <metric.icon className={`w-4 h-4 ${
                  selectedMetric === metric.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h4 className={`font-medium ${
                  selectedMetric === metric.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {metric.name}
                </h4>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Toggle Details */}
      {compareEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Comparing with previous period</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Current: +12.5%</span>
              <span>Previous: -2.1%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default PerformanceControls
