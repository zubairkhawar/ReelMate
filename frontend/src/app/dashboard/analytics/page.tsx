'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock, 
  ShoppingCart, 
  DollarSign,
  Filter,
  Download,
  Calendar,
  Globe,
  Smartphone,
  MapPin,
  Award,
  TrendingDown,
  Activity,
  Plus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  PieChart,
  LineChart,
  Map,
  Target
} from 'lucide-react'

interface KPIMetric {
  name: string
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
  secondaryValue?: string
}

const mockKPIMetrics: KPIMetric[] = [
  {
    name: 'Total Views',
    value: '2.4M',
    change: 12.5,
    changeType: 'increase',
    trend: 'up',
    icon: Eye,
    color: 'text-blue-600',
    secondaryValue: '+280K from last period'
  },
  {
    name: 'CTR',
    value: '4.2%',
    change: -2.1,
    changeType: 'decrease',
    trend: 'down',
    icon: MousePointer,
    color: 'text-green-600',
    secondaryValue: 'Industry avg: 3.8%'
  },
  {
    name: 'Avg Watch Time',
    value: '18.4s',
    change: 8.7,
    changeType: 'increase',
    trend: 'up',
    icon: Clock,
    color: 'text-purple-600',
    secondaryValue: '+1.5s from last period'
  },
  {
    name: 'Conversions',
    value: '12.8K',
    change: 15.3,
    changeType: 'increase',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-orange-600',
    secondaryValue: '+1.7K from last period'
  },
  {
    name: 'ROAS',
    value: '3.2x',
    change: 22.1,
    changeType: 'increase',
    trend: 'up',
    icon: DollarSign,
    color: 'text-emerald-600',
    secondaryValue: 'Ad spend: $45.2K'
  }
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [comparePeriod, setComparePeriod] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const getChangeColor = (change: number, changeType: string) => {
    if (changeType === 'increase') return 'text-green-600'
    return 'text-red-600'
  }

  const getChangeIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Attribution-grade insights for video creatives and campaign performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Download className="w-4 h-4 mr-2 inline" />
            Export
          </button>
        </div>
      </div>

      {/* Global Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={comparePeriod}
                onChange={(e) => setComparePeriod(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Compare to previous period</span>
            </label>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mockKPIMetrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.change, metric.changeType)}`}>
                {getChangeIcon(metric.trend)}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{metric.name}</p>
              {metric.secondaryValue && (
                <p className="text-xs text-gray-500 mt-1">{metric.secondaryValue}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'performance', name: 'Performance', icon: TrendingUp },
              { id: 'attribution', name: 'Attribution', icon: Award },
              { id: 'ab-testing', name: 'A/B Testing', icon: TrendingUp },
              { id: 'geographic', name: 'Geographic', icon: MapPin },
              { id: 'funnel', name: 'Funnel', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Time Series Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Time-series chart showing Views, CTR, Conversions, and Revenue</p>
                    <p className="text-sm text-gray-400">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                        <span className="font-medium text-gray-900">TikTok</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">980K</div>
                        <div className="text-sm text-gray-500">41%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <span className="font-medium text-gray-900">Instagram</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">720K</div>
                        <div className="text-sm text-gray-500">30%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-gray-900">Facebook</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">480K</div>
                        <div className="text-sm text-gray-500">20%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Mobile</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">1.8M</div>
                        <div className="text-sm text-gray-500">75%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Desktop</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">480K</div>
                        <div className="text-sm text-gray-500">20%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Hook Performance Analysis</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Hook
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Problem-Agitate-Solve</div>
                        <div className="text-sm text-gray-500">Sample video</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">5.2%</div>
                        <div className="text-sm text-gray-500">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">3.8%</div>
                        <div className="text-sm text-gray-500">Conv. Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">$13.5K</div>
                        <div className="text-sm text-gray-500">Revenue</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Award className="w-4 h-4 mr-1" />
                        Winner
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'overview' && activeTab !== 'performance' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis</h3>
              <p className="text-gray-500">Detailed {activeTab} analytics and insights will be displayed here</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Award className="w-5 h-5 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Promote Winner</div>
              <div className="text-sm text-gray-500">Turn winning video into ad</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Export Report</div>
              <div className="text-sm text-gray-500">CSV, PPT, or Sheets</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Schedule Report</div>
              <div className="text-sm text-gray-500">Email or Slack</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-5 h-5 text-orange-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Anomaly Alerts</div>
              <div className="text-sm text-gray-500">CTR spikes/crashes</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
