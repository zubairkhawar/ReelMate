'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/svg.png" 
              alt="ReelMate Logo" 
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" 
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-200">
              ReelMate
            </span>
          </Link>

          {/* Right: Sign In + Start Free Trial */}
          <div className="flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
