'use client'

import { useState } from 'react'
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
  X
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
  },
  {
    id: '6',
    type: 'billing',
    title: 'Payment Successful',
    description: 'Your monthly subscription payment of $99 has been processed successfully. Receipt #INV-2024-001.',
    timestamp: '1 day ago',
    isRead: true,
    priority: 'low',
    icon: CheckCircle,
    color: 'text-green-600',
    actions: ['View Receipt', 'Download Invoice']
  },
  {
    id: '7',
    type: 'system',
    title: 'Maintenance Scheduled',
    description: 'Scheduled maintenance will occur on March 15, 2024 from 2:00 AM to 4:00 AM EST. Minimal downtime expected.',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'medium',
    icon: AlertCircle,
    color: 'text-blue-600',
    actions: ['View Details', 'Set Reminder']
  },
  {
    id: '8',
    type: 'campaign',
    title: 'Campaign Performance Alert',
    description: 'Your "Winter Collection" campaign is performing 25% below average. Consider optimizing your content strategy.',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'medium',
    icon: AlertCircle,
    color: 'text-yellow-600',
    actions: ['View Analytics', 'Optimize Campaign']
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || notification.type === selectedType
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'read' && notification.isRead) ||
                         (selectedStatus === 'unread' && !notification.isRead)
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage and review all your notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Check className="w-4 h-4 mr-2 inline" />
              Mark All as Read
            </button>
          )}
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Settings className="w-4 h-4 mr-2 inline" />
            Preferences
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              More
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="type">Type</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200">
                  Export
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200">
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className={`text-lg font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-blue-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {notification.timestamp}
                          </span>
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {notification.actions && (
                      <div className="mt-4 flex items-center space-x-2">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredNotifications.length > 10 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Showing 1-10 of {filteredNotifications.length} notifications
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg">1</button>
            <button className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
