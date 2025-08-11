'use client'

import { motion } from 'framer-motion'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

export default function DemoVideo() {
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See ReelMate in Action
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI generates high-converting User Generated Content videos in seconds. 
            No actors, no filming, no editing required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Video Container */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Video Placeholder with Looping Thumbnail */}
            <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 h-80 lg:h-96 flex items-center justify-center overflow-hidden">
              {/* Looping Thumbnail Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 animate-pulse"></div>
              </div>
              
              {/* Video Preview Elements */}
              <div className="relative z-10 text-center text-white">
                {/* Prominent Play Button with Pulse Animation */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-110">
                      <Play className="w-8 h-10 lg:w-10 lg:h-12 text-blue-900 ml-1" />
                    </div>
                  </div>
                  {/* Outer Pulse Ring */}
                  <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 border-2 border-white/30 rounded-full animate-ping"></div>
                  {/* Additional Animated Ring */}
                  <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 border border-white/20 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-semibold mb-2">AI-Generated UGC Video</h3>
                <p className="text-blue-100">Click to watch demo</p>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                  "This Product Changed My Life" - UGC Style
                </h3>
                <span className="text-sm text-gray-500">15 seconds</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-gray-600">
                  <span>🎭 AI Avatar: Sarah (Friendly)</span>
                  <span>🎵 Voice: Enthusiastic</span>
                  <span>🎬 Style: Problem-Solution</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "I was struggling with [problem] until I found this amazing product! 
                    Now I can [benefit] and it's completely transformed my [area of life]. 
                    I can't believe I waited so long to try it!"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Below Video */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { label: 'Generation Time', value: '< 30 seconds', icon: '⚡' },
              { label: 'Success Rate', value: '94%', icon: '🎯' },
              { label: 'Avg. CTR', value: '3.2%', icon: '📈' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm lg:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
