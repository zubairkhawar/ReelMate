'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const error = await response.json()
        setErrors({ general: error.message || 'Failed to send reset email' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Branding/Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/svg.png" alt="ReelMate Logo" className="w-16 h-16 mb-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ReelMate
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h2>
          <p className="text-base text-gray-600 mb-4 text-center">No worries! Enter your email and we'll send you reset instructions.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-600 text-xs">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Send Reset Link</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              If you're still having trouble, contact our support team.
            </p>
            <Link
              href="/support"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block w-1/2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-200/30 rounded-full blur-xl"></div>
        
        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Reset Your Password</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              We'll help you get back to creating amazing 
              AI-powered content in no time.
            </p>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 gap-6 max-w-md">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Reset Link</h3>
                <p className="text-gray-600 text-sm">Sent directly to your email</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick & Easy</h3>
                <p className="text-gray-600 text-sm">Reset in just a few clicks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-gray-600 text-sm">We're here to help anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
