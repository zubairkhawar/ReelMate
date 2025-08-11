'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Star, Video, Zap, Shield, Users, BarChart3, Settings, Globe, Code, Headphones, Palette } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small brands getting started',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      { text: '5 AI-generated videos per month', icon: Video },
      { text: 'Basic AI avatars & voices', icon: Users },
      { text: 'Shopify integration', icon: Settings },
      { text: 'Basic analytics', icon: BarChart3 },
      { text: 'Email support', icon: Headphones }
    ],
    popular: false,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Pro',
    description: 'For growing brands scaling their advertising',
    monthlyPrice: 149,
    yearlyPrice: 119,
    features: [
      { text: '25 AI-generated videos per month', icon: Video },
      { text: 'Premium AI avatars & voices', icon: Users },
      { text: 'Advanced Shopify integration', icon: Settings },
      { text: 'A/B testing & optimization', icon: Zap },
      { text: 'Priority support', icon: Headphones },
      { text: 'Custom branding', icon: Palette },
      { text: 'Multi-platform publishing', icon: Globe }
    ],
    popular: true,
    color: 'from-blue-500 to-purple-600'
  },
  {
    name: 'Agency',
    description: 'For agencies managing multiple brands',
    monthlyPrice: 399,
    yearlyPrice: 319,
    features: [
      { text: 'Unlimited AI-generated videos', icon: Video },
      { text: 'All AI avatars & voices', icon: Users },
      { text: 'Multi-store management', icon: Settings },
      { text: 'Advanced analytics & reporting', icon: BarChart3 },
      { text: 'White-label options', icon: Shield },
      { text: 'API access', icon: Code },
      { text: 'Dedicated account manager', icon: Headphones },
      { text: 'Custom integrations', icon: Settings }
    ],
    popular: false,
    color: 'from-purple-500 to-pink-600'
  }
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, then choose the plan that grows with your business. 
            All plans include our 14-day free trial.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600 font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`bg-white rounded-3xl shadow-xl border-2 ${
                plan.popular 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 scale-105 lg:scale-110 ring-4 ring-blue-100/50' 
                  : 'border-gray-100'
              } p-6 lg:p-8 h-full transition-all duration-300 hover:shadow-2xl`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  <Link href="/auth/signup" className={`w-full py-3 px-6 rounded-full font-semibold text-white bg-gradient-to-r ${plan.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center`}>
                    Start Free Trial
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <feature.icon className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-20 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Questions about pricing?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you choose the right plan for your business.
          </p>
          <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200">
            Contact Sales
          </button>
        </motion.div>
      </div>
    </section>
  )
}
