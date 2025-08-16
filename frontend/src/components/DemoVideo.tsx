'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, Sparkles, Zap, Target } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleFullscreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const resetVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
    }
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700">AI-Powered Video Generation</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            See <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ReelMate</span> in Action
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Watch how our AI transforms your ideas into high-converting videos in seconds. 
            <br className="hidden lg:block" />
            No actors, no filming, no editing required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Video Container with Enhanced Design */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Video Player with Video Thumbnail */}
            <div 
              className="relative bg-gradient-to-br from-gray-900 to-black"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[500px] object-contain"
                preload="metadata"
                poster="/rm-thumbnail.png"
              >
                <source src="/Reelmate_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay Controls */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-500 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Center Play/Pause Button with Enhanced Design */}
                <button
                  onClick={togglePlay}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="relative">
                    {/* Glowing Background */}
                    <div className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                    
                    {/* Main Button */}
                    <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                      <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-white/30 transition-all duration-300">
                        {isPlaying ? (
                          <Pause className="w-10 h-12 lg:w-12 lg:h-14 text-gray-900" />
                        ) : (
                          <Play className="w-10 h-12 lg:w-12 lg:h-14 text-gray-900 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Top Right Controls */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <button
                    onClick={resetVideo}
                    className="group bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    title="Reset Video"
                  >
                    <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={handleFullscreen}
                    className="group bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>

                {/* Bottom Controls with Enhanced Design */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                      }}
                    />
                  </div>

                  {/* Control Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="group bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5 group-hover:scale-110 transition-transform duration-300" />
                        )}
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className="group bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                        )}
                      </button>

                      <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Video Info Section */}
            <div className="p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    ReelMate AI Video Generation Demo
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Professional AI-generated content that converts
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI Avatar</p>
                    <p className="text-sm text-gray-600">Professional & Natural</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Voice Synthesis</p>
                    <p className="text-sm text-gray-600">Natural & Engaging</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Style</p>
                    <p className="text-sm text-gray-600">Product Showcase</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Watch how ReelMate transforms your product descriptions into engaging, 
                  conversion-focused videos using AI avatars and natural voice synthesis. 
                  This demo showcases the quality and professionalism of our AI-generated content.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { 
                label: 'Generation Time', 
                value: '< 30 seconds', 
                icon: Zap,
                color: 'from-yellow-400 to-orange-500',
                description: 'Lightning fast AI processing'
              },
              { 
                label: 'Success Rate', 
                value: '94%', 
                icon: Target,
                color: 'from-green-400 to-emerald-500',
                description: 'Consistent high-quality output'
              },
              { 
                label: 'Avg. CTR', 
                value: '3.2%', 
                icon: Sparkles,
                color: 'from-purple-400 to-pink-500',
                description: 'Proven conversion performance'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-lg mb-2">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
