'use client'

import { motion } from 'framer-motion'
import { Bot, ShoppingCart, TestTube, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Generated Creators & Voices',
    description: 'Create realistic human presenters with natural voices that match your brand personality.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ShoppingCart,
    title: 'Shopify & Social Integration',
    description: 'Seamlessly connect your store and publish directly to TikTok, Instagram, and Facebook.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TestTube,
    title: 'Automatic Variation Testing',
    description: 'Generate multiple ad variations and automatically test which hooks perform best.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics & Optimization',
    description: 'Track CTR, conversions, and revenue with AI-powered optimization recommendations.',
    color: 'from-orange-500 to-red-500'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From AI-powered content creation to automated publishing and optimization, 
            ReelMate gives you the tools to dominate social media advertising.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
