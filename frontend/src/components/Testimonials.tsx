'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, CheckCircle, TrendingUp, Users, Video, DollarSign } from 'lucide-react'

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Founder, Urban Fitness Co.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    company: 'Urban Fitness Co.',
    industry: 'Fitness & Wellness',
    quote: 'ReelMate transformed our marketing completely. We went from spending $3K/month on video production to generating unlimited variations in minutes. Our Instagram engagement went up 340% in the first month.',
    stats: { 
      engagement: '+340%', 
      cost_savings: '$2.7K/month', 
      time_saved: '15hrs/week' 
    },
    rating: 5,
    verified: true,
    location: 'Miami, FL'
  },
  {
    name: 'Priya Patel',
    role: 'Marketing Manager, EcoStyle',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    company: 'EcoStyle',
    industry: 'Sustainable Fashion',
    quote: 'The AI-generated content feels so authentic. Our customers can\'t tell it\'s AI-created, and our conversion rates have doubled. The Shopify integration makes it seamless to create product-specific videos.',
    stats: { 
      conversions: '+112%', 
      roi: '4.2x', 
      videos_created: '47' 
    },
    rating: 5,
    verified: true,
    location: 'Austin, TX'
  },
  {
    name: 'Marcus Johnson',
    role: 'CEO, TechFlow Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    company: 'TechFlow Solutions',
    industry: 'SaaS & Technology',
    quote: 'As a bootstrapped startup, we couldn\'t afford expensive video production. ReelMate gave us professional-quality content that helped us close our Series A. The ROI is incredible.',
    stats: { 
      funding: '$2.1M', 
      leads: '+89%', 
      brand_awareness: '+156%' 
    },
    rating: 5,
    verified: true,
    location: 'San Francisco, CA'
  },
  {
    name: 'Sarah Chen',
    role: 'Creative Director, Bloom Beauty',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    company: 'Bloom Beauty',
    industry: 'Beauty & Cosmetics',
    quote: 'We were struggling to keep up with TikTok trends. ReelMate helps us create trending content in minutes. Our follower growth went from 200/month to 2,000/month. Game changer!',
    stats: { 
      followers: '+900%', 
      views: '+450%', 
      sales: '+78%' 
    },
    rating: 5,
    verified: true,
    location: 'Los Angeles, CA'
  },
  {
    name: 'David Kim',
    role: 'Founder, FoodieBox',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    company: 'FoodieBox',
    industry: 'Food & Beverage',
    quote: 'The voice synthesis is incredibly natural. We create videos in multiple languages without hiring voice actors. Our international sales increased by 200% after implementing multilingual content.',
    stats: { 
      intl_sales: '+200%', 
      languages: '8', 
      content_volume: '+300%' 
    },
    rating: 5,
    verified: true,
    location: 'Seattle, WA'
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
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 mb-6">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-700">Verified Customer Success</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Growing Brands</span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            See how real businesses are scaling their marketing with AI-generated content. 
            <br className="hidden lg:block" />
            Join thousands of satisfied customers worldwide.
          </p>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-6">
              Platform Statistics
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: 'Active Users', value: '12,847+', icon: Users, color: 'from-blue-500 to-blue-600' },
              { label: 'Videos Created', value: '145,392+', icon: Video, color: 'from-purple-500 to-purple-600' },
              { label: 'Success Rate', value: '96%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
              { label: 'Revenue Generated', value: '$8.4M+', icon: DollarSign, color: 'from-orange-500 to-orange-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100"
            >
              <div className="text-center">
                {/* Avatar with Real Photo */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  </div>
                  
                  {/* Verification Badge */}
                  {testimonials[currentIndex].verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-7 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed italic max-w-4xl mx-auto">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                {/* Author Info */}
                <div className="mb-8">
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600 mb-2">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>{testimonials[currentIndex].company}</span>
                    <span>•</span>
                    <span>{testimonials[currentIndex].location}</span>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 lg:gap-8">
                  {Object.entries(testimonials[currentIndex].stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                        <AnimatedCounter value={value} />
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace('_', ' ')}
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
            className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 lg:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-100"
          >
            <ChevronLeft className="w-6 h-7 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 lg:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-100"
          >
            <ChevronRight className="w-6 h-7 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8 lg:mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 w-10' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 lg:mt-24"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Join Thousands of Satisfied Customers
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start creating professional videos today and see the difference AI-powered content can make for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Easy to Use', 
                description: 'No technical skills required. Create videos in minutes, not hours.',
                icon: CheckCircle,
                color: 'from-green-500 to-emerald-500'
              },
              { 
                title: 'Proven Results', 
                description: 'Average 3.2x increase in click-through rates across all customers.',
                icon: TrendingUp,
                color: 'from-blue-500 to-purple-500'
              },
              { 
                title: '24/7 Support', 
                description: 'Get help whenever you need it with our dedicated support team.',
                icon: Users,
                color: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
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
      `}</style>
    </section>
  )
}
