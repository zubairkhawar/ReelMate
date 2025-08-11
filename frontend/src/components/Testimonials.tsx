'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, Glow Beauty',
    avatar: '👩‍💼',
    headshot: '/api/placeholder/60/60',
    quote: 'ReelMate helped us scale from 0 to $50K/month in just 3 months. The AI-generated content performs better than our human-created videos!',
    stats: { ctr: '4.2%', conversions: '+127%', revenue: '$12.4K' },
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Marketing Director, FitTech',
    avatar: '👨‍💼',
    headshot: '/api/placeholder/60/60',
    quote: 'We were spending $5K/month on video production. Now we generate unlimited variations in minutes. Our ad performance has never been better.',
    stats: { ctr: '3.8%', conversions: '+89%', revenue: '$28.7K' },
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'CEO, EcoHome',
    avatar: '👩‍💼',
    headshot: '/api/placeholder/60/60',
    quote: 'The Shopify integration is seamless. We connect our store and instantly get product-specific UGC content that converts like crazy.',
    stats: { ctr: '5.1%', conversions: '+156%', revenue: '$34.2K' },
    rating: 5
  }
]

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState('0')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          animateValue()
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`counter-${value}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [value, isVisible])

  const animateValue = () => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        current = numericValue
        clearInterval(timer)
      }
      
      if (value.includes('$')) {
        setDisplayValue(`$${Math.floor(current).toLocaleString()}`)
      } else if (value.includes('%')) {
        setDisplayValue(`${current.toFixed(1)}%`)
      } else if (value.includes('+')) {
        setDisplayValue(`+${Math.floor(current)}%`)
      } else if (value.includes('x')) {
        setDisplayValue(`${current.toFixed(1)}x`)
      } else {
        setDisplayValue(Math.floor(current).toLocaleString())
      }
    }, duration / steps)
  }

  return (
    <span id={`counter-${value}`}>
      {displayValue}{suffix}
    </span>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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
            Trusted by Growing Brands
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            See how e-commerce brands are scaling their advertising with AI-generated User Generated Content.
          </p>
        </motion.div>

        {/* Social Proof Stats - Replacing Fake Brand Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-6">
              Trusted by creators worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: 'Active Users', value: '2,847+', icon: '👥' },
              { label: 'Videos Created', value: '45,392+', icon: '🎬' },
              { label: 'Success Rate', value: '94%', icon: '🎯' },
              { label: 'Revenue Generated', value: '$2.4M+', icon: '💰' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-2xl lg:text-3xl mb-2">{stat.icon}</div>
                <div className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-gray-600 text-xs lg:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 md:p-12"
            >
              <div className="text-center">
                {/* Avatar - Consistent Circle Shape */}
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl lg:text-4xl">
                  {testimonials[currentIndex].avatar}
                </div>
                
                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg lg:text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                {/* Author */}
                <div className="mb-8">
                  <div className="text-lg font-semibold text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  {Object.entries(testimonials[currentIndex].stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                        <AnimatedCounter value={value} />
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6 lg:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: 'Active Users', value: '2,847+', icon: '👥' },
              { label: 'Videos Generated', value: '45,392+', icon: '🎬' },
              { label: 'Avg. CTR Increase', value: '3.2x', icon: '📈' },
              { label: 'Revenue Generated', value: '$2.4M+', icon: '💰' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-gray-600 text-sm lg:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
