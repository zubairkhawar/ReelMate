import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Scissors, 
  Copy, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff,
  Volume2,
  VolumeX,
  Settings,
  Download,
  Share2
} from 'lucide-react'
import { VideoScene, TimelineTrack, TimelineClip, BrandCustomization } from '../../types/videoWorkflow'

interface TimelineEditorProps {
  scenes: VideoScene[]
  onScenesUpdate: (scenes: VideoScene[]) => void
  onExport: () => void
  brandCustomization: BrandCustomization
  onBrandCustomizationUpdate: (customization: BrandCustomization) => void
}

export default function TimelineEditor({
  scenes,
  onScenesUpdate,
  onExport,
  brandCustomization,
  onBrandCustomizationUpdate
}: TimelineEditorProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'video-track',
      type: 'video',
      name: 'Video Scenes',
      clips: [],
      locked: false,
      visible: true
    },
    {
      id: 'audio-track',
      type: 'audio',
      name: 'Background Music',
      clips: [],
      locked: false,
      visible: true
    },
    {
      id: 'overlay-track',
      type: 'overlay',
      name: 'Overlays & Text',
      clips: [],
      locked: false,
      visible: true
    }
  ])

  const timelineRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)

  // Initialize clips from scenes
  useEffect(() => {
    const videoClips: TimelineClip[] = scenes.map((scene, index) => ({
      id: `scene-${scene.id}`,
      trackId: 'video-track',
      type: 'video',
      content: scene,
      startTime: index * 10, // 10 seconds per scene
      duration: scene.duration || 10,
      position: { x: index * 200, y: 0 },
      selected: false,
      trimmed: { start: 0, end: scene.duration || 10 }
    }))

    setTracks(prev => prev.map(track => 
      track.id === 'video-track' 
        ? { ...track, clips: videoClips }
        : track
    ))
  }, [scenes])

  // Playhead animation
  useEffect(() => {
    if (isPlaying && playheadRef.current) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (0.1 / zoom)
          const maxTime = getMaxTimelineDuration()
          return newTime >= maxTime ? 0 : newTime
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isPlaying, zoom])

  const getMaxTimelineDuration = () => {
    return Math.max(...tracks.flatMap(track => 
      track.clips.map(clip => clip.startTime + clip.duration)
    ), 60)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * getMaxTimelineDuration()
      setCurrentTime(Math.max(0, newTime))
    }
  }

  const handleClipDrag = (clipId: string, info: PanInfo) => {
    const newX = Math.max(0, info.point.x)
    const newTime = (newX / (timelineRef.current?.clientWidth || 1)) * getMaxTimelineDuration()
    
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === clipId 
          ? { ...clip, startTime: newTime, position: { ...clip.position, x: newX } }
          : clip
      )
    })))
  }

  const handleClipSelect = (clipId: string) => {
    setSelectedClip(clipId)
  }

  const handleClipTrim = (clipId: string, side: 'start' | 'end', value: number) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === clipId 
          ? { 
              ...clip, 
              trimmed: { 
                ...clip.trimmed, 
                [side]: Math.max(0, Math.min(value, clip.duration))
              }
            }
          : clip
      )
    })))
  }

  const handleClipDelete = (clipId: string) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.filter(clip => clip.id !== clipId)
    })))
  }

  const handleClipDuplicate = (clipId: string) => {
    const clipToDuplicate = tracks.flatMap(track => track.clips).find(clip => clip.id === clipId)
    if (!clipToDuplicate) return

    const newClip: TimelineClip = {
      ...clipToDuplicate,
      id: `${clipToDuplicate.id}-copy-${Date.now()}`,
      startTime: clipToDuplicate.startTime + clipToDuplicate.duration + 1,
      position: { 
        x: clipToDuplicate.position.x + 200, 
        y: clipToDuplicate.position.y 
      }
    }

    setTracks(prev => prev.map(track => 
      track.id === clipToDuplicate.trackId 
        ? { ...track, clips: [...track.clips, newClip] }
        : track
    ))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Timeline Editor</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlayPause}
            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <span className="text-sm text-gray-600 font-mono">
            {formatTime(currentTime)} / {formatTime(getMaxTimelineDuration())}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Zoom:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="relative mb-4">
        <div className="h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-4">
          {Array.from({ length: Math.ceil(getMaxTimelineDuration() / 10) + 1 }).map((_, i) => (
            <div key={i} className="flex-1 text-center text-xs text-gray-500">
              {formatTime(i * 10)}
            </div>
          ))}
        </div>
        {/* Playhead */}
        <motion.div
          ref={playheadRef}
          className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
          style={{
            left: `${(currentTime / getMaxTimelineDuration()) * 100}%`
          }}
        />
      </div>

      {/* Timeline Tracks */}
      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="border border-gray-200 rounded-lg">
            {/* Track Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTracks(prev => prev.map(t => 
                    t.id === track.id ? { ...t, visible: !t.visible } : t
                  ))}
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  {track.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTracks(prev => prev.map(t => 
                    t.id === track.id ? { ...t, locked: !t.locked } : t
                  ))}
                  className={`p-1 ${track.locked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Lock className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700">{track.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {track.clips.length} clips
                </span>
              </div>
            </div>

            {/* Track Content */}
            <div className="relative h-24 bg-gray-25 overflow-hidden">
              <div
                ref={timelineRef}
                className="relative w-full h-full cursor-pointer"
                onClick={handleTimelineClick}
              >
                {track.clips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    className={`absolute top-2 h-20 rounded-lg border-2 cursor-move ${
                      clip.selected 
                        ? 'border-purple-500 bg-purple-100' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    } ${!track.visible ? 'opacity-50' : ''}`}
                    style={{
                      left: `${(clip.startTime / getMaxTimelineDuration()) * 100}%`,
                      width: `${(clip.duration / getMaxTimelineDuration()) * 100}%`,
                      zIndex: clip.selected ? 10 : 1
                    }}
                    drag="x"
                    dragMomentum={false}
                    dragElastic={0}
                    onDrag={(_, info) => handleClipDrag(clip.id, info)}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClipSelect(clip.id)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {clip.content.name || `Clip ${clip.id}`}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClipDuplicate(clip.id)
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClipDelete(clip.id)
                            }}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center">
                        {clip.type === 'video' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex items-center justify-center">
                            <Play className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        {clip.type === 'audio' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded flex items-center justify-center">
                            <Volume2 className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        {clip.type === 'overlay' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded flex items-center justify-center">
                            <Settings className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        {formatTime(clip.duration)}
                      </div>
                    </div>

                    {/* Trim Handles */}
                    <div className="absolute left-0 top-0 w-2 h-full bg-purple-500 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="absolute right-0 top-0 w-2 h-full bg-purple-500 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentTime(0)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go to Start
          </button>
          <button
            onClick={() => setCurrentTime(getMaxTimelineDuration())}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go to End
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onExport}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Video</span>
          </button>
        </div>
      </div>
    </div>
  )
}
