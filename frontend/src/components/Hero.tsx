'use client'

import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 lg:pt-24 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
              >
                Scale Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-5xl lg:text-6xl xl:text-7xl font-extrabold">
                  AI UGC Agency
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg lg:text-xl text-gray-600 leading-relaxed"
              >
                Generate, test, and deploy unlimited high-converting ads — no filming required.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/auth/signup" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                Start Free Trial
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-gray-300 transform hover:scale-105 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play mr-2 h-5 w-5" aria-hidden="true">
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path>
                </svg>
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center space-x-6 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Product Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 lg:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="bg-gray-200 rounded-lg h-24 lg:h-32 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 lg:p-4"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl lg:text-2xl">🎯</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 lg:p-4"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl lg:text-2xl">🚀</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
