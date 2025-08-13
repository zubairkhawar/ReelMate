'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  FolderOpen, 
  Video, 
  Image, 
  FileText, 
  Download, 
  Share2, 
  Edit3, 
  Trash2, 
  Eye, 
  Plus,
  Heart,
  MoreVertical,
  ChevronDown,
  Play,
  Volume2,
  Upload
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: 'video' | 'image' | 'document' | 'audio'
  thumbnail: string
  duration?: string
  size: string
  format: string
  tags: string[]
  category: string
  status: 'published' | 'draft' | 'archived' | 'processing'
  views: number
  likes: number
  comments: number
  shares: number
  createdAt: string
  updatedAt: string
  creator: string
  campaign?: string
  description?: string
  metadata: {
    resolution?: string
    fps?: number
    bitrate?: string
    dimensions?: string
    fileSize?: string
  }
}

interface Category {
  id: string
  name: string
  count: number
  color: string
}

interface FilterState {
  search: string
  type: string[]
  category: string[]
  status: string[]
  dateRange: string
  tags: string[]
  creator: string[]
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Summer Collection Product Showcase',
    type: 'video',
    thumbnail: '/api/placeholder/300/200',
    duration: '00:30',
    size: '15.2 MB',
    format: 'MP4',
    tags: ['summer', 'fashion', 'product', 'showcase'],
    category: 'Product Videos',
    status: 'published',
    views: 15420,
    likes: 892,
    comments: 156,
    shares: 234,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    creator: 'AI Studio',
    campaign: 'Summer Collection 2024',
    description: 'Dynamic product showcase featuring the latest summer collection items with engaging transitions and lifestyle context.',
    metadata: {
      resolution: '1920x1080',
      fps: 30,
      bitrate: '5 Mbps',
      fileSize: '15.2 MB'
    }
  },
  {
    id: '2',
    title: 'Customer Testimonial - Sarah M.',
    type: 'video',
    thumbnail: '/api/placeholder/300/200',
    duration: '00:45',
    size: '22.8 MB',
    format: 'MP4',
    tags: ['testimonial', 'customer', 'review', 'authentic'],
    category: 'Testimonials',
    status: 'published',
    views: 8920,
    likes: 567,
    comments: 89,
    shares: 123,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
    creator: 'AI Studio',
    campaign: 'Trust Building',
    description: 'Authentic customer testimonial highlighting product benefits and real user experience.',
    metadata: {
      resolution: '1920x1080',
      fps: 30,
      bitrate: '6 Mbps',
      fileSize: '22.8 MB'
    }
  }
]

const categories: Category[] = [
  { id: '1', name: 'Product Videos', count: 45, color: 'bg-blue-500' },
  { id: '2', name: 'Testimonials', count: 23, color: 'bg-green-500' },
  { id: '3', name: 'Educational', count: 18, color: 'bg-purple-500' },
  { id: '4', name: 'Behind the Scenes', count: 12, color: 'bg-orange-500' },
  { id: '5', name: 'Reports', count: 8, color: 'bg-red-500' },
  { id: '6', name: 'Social Media', count: 67, color: 'bg-pink-500' }
]

export default function ContentLibraryPage() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(mockContent)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: [],
    category: [],
    status: [],
    dateRange: '',
    tags: [],
    creator: []
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, sortBy])

  const applyFilters = () => {
    let filtered = [...content]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(item => filters.type.includes(item.type))
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category))
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status))
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'most-viewed':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'most-liked':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredContent(filtered)
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAll = () => {
    setSelectedItems(filteredContent.map(item => item.id))
  }

  const deselectAll = () => {
    setSelectedItems([])
  }

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) return

    switch (action) {
      case 'delete':
        setContent(prev => prev.filter(item => !selectedItems.includes(item.id)))
        setSelectedItems([])
        break
      case 'archive':
        setContent(prev =>
          prev.map(item =>
            selectedItems.includes(item.id)
              ? { ...item, status: 'archived' as const }
              : item
          )
        )
        setSelectedItems([])
        break
      case 'download':
        console.log('Downloading:', selectedItems)
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video
      case 'image':
        return Image
      case 'document':
        return FileText
      case 'audio':
        return Volume2
      default:
        return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
              <p className="text-gray-600 mt-2">
                Manage and organize all your content assets in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create New</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Content</p>
                  <p className="text-2xl font-bold text-gray-900">{content.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {content.reduce((sum, item) => sum + item.likes, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Share2 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Shares</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {content.reduce((sum, item) => sum + item.shares, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-viewed">Most Viewed</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <div className="space-y-2">
                      {['video', 'image', 'document', 'audio'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.type.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, type: [...prev.type, type] }))
                              } else {
                                setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.category.includes(category.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, category: [...prev.category, category.name] }))
                              } else {
                                setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category.name) }))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                          <span className="ml-auto text-xs text-gray-500">({category.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="space-y-2">
                      {['published', 'draft', 'archived', 'processing'].map((status) => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, status: [...prev.status, status] }))
                              } else {
                                setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={selectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Deselect All
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('download')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-800 ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {React.createElement(getTypeIcon(item.type), { className: "w-4 h-4 text-gray-500" })}
                        <span className="text-xs text-gray-500 uppercase">{item.type}</span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{item.size}</span>
                      {item.duration && <span>{item.duration}</span>}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContent(item)
                          setShowPreview(true)
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                      >
                        <Eye className="w-5 h-5 text-gray-800" />
                      </button>
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                        <Download className="w-5 h-5 text-gray-800" />
                      </button>
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                        <Share2 className="w-5 h-5 text-gray-800" />
                      </button>
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                        <Edit3 className="w-5 h-5 text-gray-800" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.type.length > 0 || filters.category.length > 0 || filters.status.length > 0
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by uploading your first piece of content.'}
            </p>
            <button className="btn-primary flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Upload Content</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
