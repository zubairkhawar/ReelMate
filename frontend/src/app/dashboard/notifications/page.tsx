'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Zap, 
  MessageSquare,
  Settings,
  Download,
  Trash2,
  Eye,
  Archive,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Loader2,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'system' | 'order' | 'approval' | 'campaign' | 'integration' | 'billing'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  icon: any
  color: string
  actions?: string[]
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, selectedType, selectedPriority])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      // Fetch notification preferences first
      const prefsResponse = await fetch('http://localhost:5001/api/profile/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json()
        console.log('Notification preferences:', prefsData)
      }

      // For now, we'll use enhanced mock data since we don't have a real notifications table yet
      // In a real app, you'd fetch from /api/notifications or similar endpoint
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'system',
          title: 'System Update Complete',
          description: 'Your dashboard has been updated with new features and improvements. All services are now running on the latest version.',
          timestamp: '2 minutes ago',
          isRead: false,
          priority: 'high',
          icon: Zap,
          color: 'text-blue-600',
          actions: ['View Details', 'Dismiss']
        },
        {
          id: '2',
          type: 'campaign',
          title: 'UGC Campaign Approved',
          description: 'Your "Summer Collection" campaign has been approved and is now live. You can now start generating videos.',
          timestamp: '15 minutes ago',
          isRead: false,
          priority: 'medium',
          icon: CheckCircle,
          color: 'text-green-600',
          actions: ['View Campaign', 'Start Creating']
        },
        {
          id: '3',
          type: 'integration',
          title: 'Shopify Sync Successful',
          description: 'Product data has been successfully synced from your Shopify store. 45 new products are now available for video creation.',
          timestamp: '1 hour ago',
          isRead: true,
          priority: 'low',
          icon: Package,
          color: 'text-purple-600',
          actions: ['View Products', 'Create Videos']
        },
        {
          id: '4',
          type: 'order',
          title: 'New Video Order',
          description: 'You have a new video order from client "Fashion Brand Co." for 10 UGC videos. Order value: $2,500.',
          timestamp: '2 hours ago',
          isRead: false,
          priority: 'high',
          icon: Package,
          color: 'text-orange-600',
          actions: ['View Order', 'Accept', 'Decline']
        },
        {
          id: '5',
          type: 'approval',
          title: 'Content Review Required',
          description: '3 new videos are pending your review and approval. These videos are scheduled to go live tomorrow.',
          timestamp: '3 hours ago',
          isRead: true,
          priority: 'medium',
          icon: AlertCircle,
          color: 'text-yellow-600',
          actions: ['Review Videos', 'Approve All', 'Request Changes']
        }
      ]

      setNotifications(mockNotifications)
      
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to fetch notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType)
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notification => notification.priority === selectedPriority)
    }

    setFilteredNotifications(filtered)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return Zap
      case 'campaign':
        return CheckCircle
      case 'integration':
        return Package
      case 'order':
        return Package
      case 'approval':
        return AlertCircle
      case 'billing':
        return CreditCard
      default:
        return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-blue-600'
      case 'campaign':
        return 'text-green-600'
      case 'integration':
        return 'text-purple-600'
      case 'order':
        return 'text-orange-600'
      case 'approval':
        return 'text-yellow-600'
      case 'billing':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading notifications...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Notifications</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your account activity and important updates</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Check className="w-4 h-4 mr-2 inline" />
                Mark All as Read
              </button>
            )}
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Preferences
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.isRead).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="campaign">Campaign</option>
                <option value="integration">Integration</option>
                <option value="order">Order</option>
                <option value="approval">Approval</option>
                <option value="billing">Billing</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const IconComponent = getTypeIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-sm font-semibold ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{notification.timestamp}</span>
                              <span>•</span>
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
