'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ExternalLink, 
  RefreshCw, 
  Settings, 
  Database, 
  Webhook,
  ShoppingCart,
  Facebook,
  Instagram,
  Video,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  Globe,
  Clock,
  Activity,
  Shield,
  Users,
  FileText,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'needs_action' | 'disconnected'
  icon: any
  color: string
  lastSync?: string
  webhookHealth?: 'healthy' | 'warning' | 'error'
  connectedAccounts?: number
  features: string[]
}

const integrations: Integration[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your Shopify store to sync products, orders, and analytics',
    status: 'connected',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-600',
    lastSync: '2 minutes ago',
    webhookHealth: 'healthy',
    connectedAccounts: 1,
    features: [
      'Product sync & management',
      'Order tracking & attribution',
      'Webhook health monitoring',
      'Collection-based video templates'
    ]
  },
  {
    id: 'meta',
    name: 'Meta (Facebook + Instagram)',
    description: 'Connect Business Manager and Ad Accounts for ad spend and conversion tracking',
    status: 'needs_action',
    icon: Facebook,
    color: 'from-blue-500 to-indigo-600',
    connectedAccounts: 2,
    features: [
      'Ad spend & conversion tracking',
      'Business Manager integration',
      'Page & ad account management',
      'Campaign-to-product mapping'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Business',
    description: 'Connect TikTok Business account for metrics and campaign creation',
    status: 'disconnected',
    icon: Video,
    color: 'from-pink-500 to-rose-600',
    features: [
      'Ad account integration',
      'Metrics & performance data',
      'Campaign creation from winning videos',
      'Creative optimization insights'
    ]
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Connect GA4 for comprehensive conversion tracking and attribution',
    status: 'disconnected',
    icon: Activity,
    color: 'from-orange-500 to-red-600',
    features: [
      'Conversion tracking',
      'Attribution modeling',
      'Audience insights',
      'ROAS calculation'
    ]
  }
]

export default function IntegrationsPage() {
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'needs_action':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-400" />
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'needs_action':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'disconnected':
        return 'text-gray-500 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getWebhookHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your tools and platforms to unlock powerful features</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrations List */}
        <div className="lg:col-span-2 space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Integration Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${integration.color} rounded-lg flex items-center justify-center`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-gray-600 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span className="ml-2 capitalize">{integration.status.replace('_', ' ')}</span>
                    </span>
                    
                    <button
                      onClick={() => setExpandedIntegration(expandedIntegration === integration.id ? null : integration.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {expandedIntegration === integration.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                  {integration.lastSync && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Last sync: {integration.lastSync}</span>
                    </div>
                  )}
                  
                  {integration.webhookHealth && (
                    <div className="flex items-center space-x-2">
                      <Webhook className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWebhookHealthColor(integration.webhookHealth)}`}>
                        {integration.webhookHealth}
                      </span>
                    </div>
                  )}
                  
                  {integration.connectedAccounts && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{integration.connectedAccounts} account{integration.connectedAccounts > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedIntegration === integration.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                      <ul className="space-y-2">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                      <div className="space-y-2">
                        {integration.status === 'connected' ? (
                          <>
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Now
                            </button>
                          </>
                        ) : integration.status === 'needs_action' ? (
                          <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Complete Setup
                          </button>
                        ) : (
                          <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Integration-specific Settings */}
                  {integration.id === 'shopify' && (
                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">Shopify Settings</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="block text-gray-600 mb-1">Auto-sync bestsellers</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>Enabled</option>
                            <option>Disabled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Include collections</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>All collections</option>
                            <option>Selected only</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">Default template</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>Product showcase</option>
                            <option>Testimonial</option>
                            <option>Comparison</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {integration.id === 'meta' && (
                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">Meta Integration</h5>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Business Manager</span>
                          <span className="text-green-600 font-medium">Connected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Ad Account</span>
                          <span className="text-yellow-600 font-medium">Needs review</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Pages</span>
                          <span className="text-green-600 font-medium">2 connected</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Sidebar - Integration Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connected</span>
                <span className="text-sm font-medium text-green-600">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Needs Action</span>
                <span className="text-sm font-medium text-yellow-600">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disconnected</span>
                <span className="text-sm font-medium text-gray-600">2</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Zap className="w-4 h-4 mr-2" />
                  Test All Connections
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <FileText className="w-4 h-4 mr-2" />
                  View Logs
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Documentation</h4>
              <div className="space-y-2">
                <Link href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Setup Guide
                </Link>
                <Link href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Reference
                </Link>
                <Link href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Troubleshooting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
