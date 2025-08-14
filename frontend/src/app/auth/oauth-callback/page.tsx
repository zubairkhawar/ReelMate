'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token')
        const user = searchParams.get('user')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage('OAuth authentication failed. Please try again.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        if (!token || !user) {
          setStatus('error')
          setMessage('Invalid OAuth callback. Please try again.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(user))

        // Store in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))

        setStatus('success')
        setMessage('Authentication successful! Redirecting to dashboard...')

        // Redirect to dashboard
        setTimeout(() => router.push('/dashboard'), 2000)
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setMessage('An error occurred during authentication.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router])

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Authentication</h2>
            <p className="text-gray-600">Please wait while we complete your sign-in...</p>
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ReelMate!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center border border-gray-100"
      >
        {getStatusContent()}
        
        {status === 'loading' && (
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
