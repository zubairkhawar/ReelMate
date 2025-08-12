'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Key, 
  Users, 
  Activity, 
  Download,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Building,
  Phone,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  Smartphone,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  company: string
  timezone: string
  phone: string
  avatar: string
  role: string
  joinDate: string
}

interface ApiKey {
  id: string
  name: string
  provider: string
  lastUsed: string
  usage: string
  status: 'active' | 'expired' | 'revoked'
  key: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  lastActive: string
  avatar: string
}

interface ActivityLog {
  id: string
  action: string
  description: string
  timestamp: string
  ip: string
  location: string
  device: string
}

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@company.com',
  company: 'Tech Solutions Inc.',
  timezone: 'UTC-5 (Eastern Time)',
  phone: '+1 (555) 123-4567',
  avatar: '/api/placeholder/100/100',
  role: 'Admin',
  joinDate: 'January 2024'
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'OpenAI Production',
    provider: 'OpenAI',
    lastUsed: '2 hours ago',
    usage: '1,247 requests',
    status: 'active',
    key: 'sk-...abc123'
  },
  {
    id: '2',
    name: 'ElevenLabs Voice',
    provider: 'ElevenLabs',
    lastUsed: '1 day ago',
    usage: '89 voice generations',
    status: 'active',
    key: 'xi-api-...def456'
  },
  {
    id: '3',
    name: 'Stable Diffusion',
    provider: 'Stability AI',
    lastUsed: '3 days ago',
    usage: '234 image generations',
    status: 'expired',
    key: 'sk-...ghi789'
  }
]

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'manager',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'editor',
    status: 'active',
    lastActive: '1 day ago',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: 'viewer',
    status: 'pending',
    lastActive: 'Never',
    avatar: '/api/placeholder/40/40'
  }
]

const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    action: 'Login',
    description: 'Successful login from New York, NY',
    timestamp: '2 hours ago',
    ip: '192.168.1.1',
    location: 'New York, NY',
    device: 'Chrome on MacOS'
  },
  {
    id: '2',
    action: 'Campaign Created',
    description: 'Created new UGC campaign "Summer Collection"',
    timestamp: '4 hours ago',
    ip: '192.168.1.1',
    location: 'New York, NY',
    device: 'Chrome on MacOS'
  },
  {
    id: '3',
    action: 'API Key Updated',
    description: 'Updated OpenAI API key',
    timestamp: '1 day ago',
    ip: '192.168.1.1',
    location: 'New York, NY',
    device: 'Chrome on MacOS'
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [profile, setProfile] = useState(mockUserProfile)
  const [editedProfile, setEditedProfile] = useState(mockUserProfile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(showApiKey === keyId ? null : keyId)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'editor': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, security, and team access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 mr-2 inline" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-2 inline" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar & Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{profile.name}</h4>
                    <p className="text-sm text-gray-500">{profile.role}</p>
                    <p className="text-xs text-gray-400">Member since {profile.joinDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>

              {/* Company & Contact Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.company}
                      onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  {isEditing ? (
                    <select
                      value={editedProfile.timezone}
                      onChange={(e) => setEditedProfile({...editedProfile, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (Central European)</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.timezone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security</h3>
            
            <div className="space-y-6">
              {/* Password */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/change-password"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Change Password
                </Link>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">SMS verification enabled</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Configure
                </button>
              </div>

              {/* SSO */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Single Sign-On (SSO)</h4>
                    <p className="text-sm text-gray-500">Google Workspace connected</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">API Keys & Integrations</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add API Key
              </button>
            </div>

            <div className="space-y-4">
              {mockApiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Key className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                      <p className="text-sm text-gray-500">{apiKey.provider} • {apiKey.usage}</p>
                      <p className="text-xs text-gray-400">Last used: {apiKey.lastUsed}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apiKey.status === 'active' ? 'bg-green-100 text-green-800' :
                      apiKey.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apiKey.status}
                    </span>
                    
                    <button
                      onClick={() => toggleApiKeyVisibility(apiKey.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      {showApiKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2 inline" />
                Invite Member
              </button>
            </div>

            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">Last active: {member.lastActive}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Activity & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockActivityLog.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link 
                href="/dashboard/activity" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium block text-center"
              >
                View all activity
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/billing"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                <span>Billing & Subscription</span>
              </Link>
              
              <Link
                href="/dashboard/notifications"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Bell className="w-5 h-5 mr-3 text-green-600" />
                <span>Notification Preferences</span>
              </Link>
              
              <Link
                href="/dashboard/team"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Users className="w-5 h-5 mr-3 text-purple-600" />
                <span>Team Management</span>
              </Link>
              
              <Link
                href="/dashboard/integrations"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-5 h-5 mr-3 text-orange-600" />
                <span>Integrations</span>
              </Link>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="text-sm font-medium text-gray-900">Pro Plan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credits</span>
                <span className="text-sm font-medium text-gray-900">1,247 remaining</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next billing</span>
                <span className="text-sm font-medium text-gray-900">March 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
