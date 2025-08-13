'use client'

import { 
  LayoutDashboard, 
  Video, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X,
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  FolderOpen,
  Users,
  Building2,
  FileText,
  Scissors,
  Layers,
  Download,
  Link as LinkIcon,

  CreditCard,
  Sparkles,
  Check,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Zap,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'system' | 'order' | 'approval' | 'campaign' | 'integration'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  icon: any
  color: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'System Update Complete',
    description: 'Your dashboard has been updated with new features and improvements.',
    timestamp: '2 minutes ago',
    isRead: false,
    icon: Zap,
    color: 'text-blue-600'
  },
  {
    id: '2',
    type: 'campaign',
    title: 'UGC Campaign Approved',
    description: 'Your "Summer Collection" campaign has been approved and is now live.',
    timestamp: '15 minutes ago',
    isRead: false,
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: '3',
    type: 'integration',
    title: 'Shopify Sync Successful',
    description: 'Product data has been successfully synced from your Shopify store.',
    timestamp: '1 hour ago',
    isRead: true,
    icon: Package,
    color: 'text-purple-600'
  },
  {
    id: '4',
    type: 'order',
    title: 'New Video Order',
    description: 'You have a new video order from client "Fashion Brand Co."',
    timestamp: '2 hours ago',
    isRead: false,
    icon: Package,
    color: 'text-orange-600'
  },
  {
    id: '5',
    type: 'approval',
    title: 'Content Review Required',
    description: '3 new videos are pending your review and approval.',
    timestamp: '3 hours ago',
    isRead: true,
    icon: AlertCircle,
    color: 'text-yellow-600'
  }
]

const navigation = {
  main: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Campaigns',
      href: '/dashboard/campaigns',
      icon: Video
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3
    },
    {
      name: 'Content Library',
      href: '/dashboard/content',
      icon: FolderOpen
    },
    {
      name: 'Creators',
      href: '/dashboard/creators',
      icon: Users
    },
    {
      name: 'Brands',
      href: '/dashboard/brands',
      icon: Building2
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: FileText
    },
    {
      name: 'AI Studio',
      href: '/dashboard/ai-studio',
      icon: Sparkles
    }
  ],
  tools: [
    {
      name: 'Video Editor',
      href: '/dashboard/video-editor',
      icon: Scissors
    },
    {
      name: 'Batch Processing',
      href: '/dashboard/batch-processing',
      icon: Layers
    },
    {
      name: 'Export Tools',
      href: '/dashboard/export',
      icon: Download
    },
    {
      name: 'Integrations',
      href: '/dashboard/integrations',
      icon: LinkIcon
    }
  ],
  account: [

    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    }
  ]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState(['main', 'tools', 'account'])
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-dropdown') && !target.closest('.notifications-dropdown')) {
        setUserDropdownOpen(false)
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const markNotificationAsRead = (notificationId: string) => {
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

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img 
                  src="/svg.png" 
                  alt="ReelMate Logo" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ReelMate
                </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto">
              {Object.entries(navigation).map(([sectionKey, sectionItems]) => (
                <div key={sectionKey} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                      {sectionKey === 'main' ? 'MAIN' : sectionKey === 'tools' ? 'TOOLS' : 'ACCOUNT'}
                    </h3>
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {expandedSections.includes(sectionKey) ? (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
        </div>

                  {expandedSections.includes(sectionKey) && (
                    <div className="space-y-1">
                      {sectionItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <item.icon
                              className="mr-3 h-5 w-5 transition-colors duration-200 ${
                                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                              }"
                            />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className={`hidden lg:block fixed left-0 top-0 h-screen bg-white shadow-xl z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
              <img 
                src="/svg.png" 
                alt="ReelMate Logo" 
                className="w-8 h-8"
              />
              {!sidebarCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ReelMate
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </div>

        {/* Navigation */}
          <nav className="px-3 py-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
            {Object.entries(navigation).map(([sectionKey, sectionItems]) => (
              <div key={sectionKey} className="mb-6">
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                      {sectionKey === 'main' ? 'MAIN' : sectionKey === 'tools' ? 'TOOLS' : 'ACCOUNT'}
                    </h3>
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {expandedSections.includes(sectionKey) ? (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
                
                {expandedSections.includes(sectionKey) && (
          <div className="space-y-1">
                    {sectionItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                          title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon
                            className={`transition-colors duration-200 ${
                              sidebarCollapsed ? 'mx-auto' : 'mr-3'
                            } h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                          {!sidebarCollapsed && item.name}
                </Link>
              )
            })}
          </div>
                )}
              </div>
            ))}
            
            {/* Usage Meter */}
            {!sidebarCollapsed && (
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Credits left</span>
                  <span className="font-medium text-gray-900">1,247</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">Trial: 12 days left</div>
              </div>
            )}
        </nav>
      </div>

      {/* Main content */}
        <div className={`flex-1 min-h-screen bg-gray-50 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Sticky Top Bar */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

              {/* Page Title */}
              <div className="flex-1 max-w-lg mx-4 lg:mx-8">
                <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns, products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative notifications-dropdown">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
                  >
                <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => markNotificationAsRead(notification.id)}
                                className={`flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                                  notification.isRead 
                                    ? 'bg-white' 
                                    : 'bg-blue-50 border-l-4 border-l-blue-500'
                                }`}
                              >
                                {/* Icon */}
                                <div className="flex-shrink-0 mr-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100`}>
                                    <notification.icon className={`w-4 h-4 ${notification.color}`} />
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${
                                    notification.isRead ? 'text-gray-900' : 'text-blue-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {notification.description}
                                  </p>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {notification.timestamp}
                                  </div>
                                </div>

                                {/* Unread Indicator */}
                                {!notification.isRead && (
                                  <div className="flex-shrink-0 ml-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center">
                              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="border-t border-gray-200 px-4 py-2">
                            <Link 
                              href="/dashboard/notifications" 
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium block text-center hover:bg-blue-50 py-1 rounded transition-colors duration-200"
                            >
                              View all notifications
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative user-dropdown">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {/* Profile Option */}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false)
                            router.push('/dashboard/profile')
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          Profile
                        </button>
                        
                        {/* Change Password Option */}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false)
                            router.push('/dashboard/change-password')
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-400" />
                          Change Password
                        </button>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        {/* Sign Out Option */}
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
              </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
