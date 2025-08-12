'use client'

import { useState } from 'react'
import { 
  Download, 
  Video, 
  Settings, 
  Cloud, 
  Play, 
  CheckSquare, 
  Square, 
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  Globe,
  Zap,
  Clock,
  Package,
  Share2,
  ExternalLink,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Copy,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface VideoItem {
  id: string
  name: string
  thumbnail: string
  duration: string
  platform: string
  format: string
  size: string
  selected: boolean
}

interface ExportPreset {
  id: string
  name: string
  platform: string
  resolution: string
  format: string
  maxDuration: string
  bitrate: string
  description: string
}

const exportPresets: ExportPreset[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    platform: 'TikTok',
    resolution: '9:16',
    format: 'MP4',
    maxDuration: '60s max',
    bitrate: 'Recommended',
    description: 'Optimized for TikTok vertical video format'
  },
  {
    id: 'instagram-reels',
    name: 'Instagram Reels',
    platform: 'Instagram',
    resolution: '9:16 / 4:5',
    format: 'MP4',
    maxDuration: '90s max',
    bitrate: 'High quality',
    description: 'Perfect for Instagram Reels and Stories'
  },
  {
    id: 'facebook-feed',
    name: 'Facebook Feed',
    platform: 'Facebook',
    resolution: '16:9',
    format: 'MP4',
    maxDuration: '240s max',
    bitrate: 'Standard',
    description: 'Optimized for Facebook news feed'
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    platform: 'YouTube',
    resolution: '9:16',
    format: 'MP4',
    maxDuration: '60s max',
    bitrate: 'High quality',
    description: 'Perfect for YouTube Shorts format'
  }
]

const mockVideos: VideoItem[] = [
  {
    id: '1',
    name: 'Summer Collection UGC Video',
    thumbnail: '/api/placeholder/120/80',
    duration: '0:45',
    platform: 'TikTok',
    format: 'MP4',
    size: '12.5 MB',
    selected: false
  },
  {
    id: '2',
    name: 'Product Demo - New Features',
    thumbnail: '/api/placeholder/120/80',
    duration: '1:20',
    platform: 'Instagram',
    format: 'MP4',
    size: '18.2 MB',
    selected: false
  },
  {
    id: '3',
    name: 'Customer Testimonial - Sarah',
    thumbnail: '/api/placeholder/120/80',
    duration: '0:58',
    platform: 'Facebook',
    format: 'MP4',
    size: '15.8 MB',
    selected: false
  },
  {
    id: '4',
    name: 'Behind the Scenes - Office Tour',
    thumbnail: '/api/placeholder/120/80',
    duration: '2:15',
    platform: 'YouTube',
    format: 'MP4',
    size: '28.4 MB',
    selected: false
  }
]

export default function ExportToolsPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('tiktok')
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos)
  const [exportOptions, setExportOptions] = useState({
    includeSubtitles: true,
    burnedInCaptions: false,
    watermark: true,
    logoPlacement: 'bottom-right',
    quality: 'high',
    includeAlpha: false
  })
  const [cloudDestination, setCloudDestination] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const toggleVideoSelection = (videoId: string) => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, selected: !video.selected } : video
    ))
  }

  const selectAllVideos = () => {
    setVideos(videos.map(video => ({ ...video, selected: true })))
  }

  const deselectAllVideos = () => {
    setVideos(videos.map(video => ({ ...video, selected: false })))
  }

  const selectedVideosCount = videos.filter(v => v.selected).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Tools</h1>
          <p className="text-gray-600 mt-1">Export and deliver your videos optimized for each platform</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Download className="w-4 h-4 mr-2 inline" />
          Export Selected
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Preset Selector & Video List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export Presets */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPreset === preset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{preset.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{preset.resolution}</span>
                      <span>•</span>
                      <span>{preset.format}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Max: {preset.maxDuration}</span>
                    <span>{preset.bitrate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Videos</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectAllVideos}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Select All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={deselectAllVideos}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <button
                    onClick={() => toggleVideoSelection(video.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {video.selected ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="w-20 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.platform}</span>
                      <span>•</span>
                      <span>{video.size}</span>
                    </div>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Export Options */}
        <div className="lg:col-span-1 space-y-6">
          {/* Export Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            
            {/* Subtitles & Captions */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-900">Subtitles & Captions</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeSubtitles}
                    onChange={(e) => setExportOptions({...exportOptions, includeSubtitles: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include SRT/VTT files</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.burnedInCaptions}
                    onChange={(e) => setExportOptions({...exportOptions, burnedInCaptions: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Burned-in captions</span>
                </label>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-900">Branding</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.watermark}
                    onChange={(e) => setExportOptions({...exportOptions, watermark: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Add watermark</span>
                </label>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Logo placement</label>
                  <select
                    value={exportOptions.logoPlacement}
                    onChange={(e) => setExportOptions({...exportOptions, logoPlacement: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quality & Format */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-900">Quality & Format</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Quality</label>
                  <select
                    value={exportOptions.quality}
                    onChange={(e) => setExportOptions({...exportOptions, quality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAlpha}
                    onChange={(e) => setExportOptions({...exportOptions, includeAlpha: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Retain alpha channel</span>
                </label>
              </div>
            </div>

            {/* Cloud Destination */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Cloud Destination</h4>
              <select
                value={cloudDestination}
                onChange={(e) => setCloudDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select destination</option>
                <option value="dropbox">Dropbox</option>
                <option value="google-drive">Google Drive</option>
                <option value="s3">Amazon S3</option>
                <option value="cloudinary">Cloudinary</option>
              </select>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Videos selected:</span>
                <span className="font-medium">{selectedVideosCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preset:</span>
                <span className="font-medium">{exportPresets.find(p => p.id === selectedPreset)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">MP4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quality:</span>
                <span className="font-medium capitalize">{exportOptions.quality}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <Download className="w-4 h-4 mr-2" />
                Export {selectedVideosCount} Video{selectedVideosCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Package className="w-4 h-4 mr-2" />
                Generate Ad Package
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <Share2 className="w-4 h-4 mr-2" />
                One-Click Publish
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <FileText className="w-4 h-4 mr-2" />
                Export Metadata
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
