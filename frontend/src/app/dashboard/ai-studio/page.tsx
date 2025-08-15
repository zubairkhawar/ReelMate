'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Plus, 
  Save, 
  Settings, 
  HelpCircle, 
  Send, 
  Mic, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Code,
  Check,
  Bot,
  User,
  Sparkles,
  Zap,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Video,
  Users,
  Mic as MicIcon
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isCode?: boolean
  language?: string
  hasImage?: boolean
  imageUrl?: string
  isTable?: boolean
  tableData?: any
  feedback?: 'positive' | 'negative' | null
}

interface ChatSession {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'UGC Video Script Generation',
    createdAt: new Date('2024-02-15'),
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Create a 30-second UGC video script for a fitness app that focuses on motivation and results. The target audience is busy professionals aged 25-40.',
        timestamp: new Date('2024-02-15T10:00:00')
      },
      {
        id: '2',
        role: 'assistant',
        content: `Here's a motivational 30-second UGC script for your fitness app:

**Hook (0-5s):**
"Tired of making excuses? Your future self is watching."

**Problem (5-15s):**
"Between work, family, and life, finding time to work out feels impossible. But what if I told you that just 15 minutes a day could change everything?"

**Solution (15-25s):**
"With [App Name], you get personalized workouts that fit your schedule. No gym needed, no equipment required. Just you, your phone, and results that speak for themselves."

**CTA (25-30s):**
"Stop waiting for tomorrow. Start transforming today. Download [App Name] now and join thousands who've already changed their lives."

**Tone:** Energetic, motivational, but not overwhelming
**Pace:** Builds from calm to energetic
**Key Words:** Transform, results, personalized, convenient`,
        timestamp: new Date('2024-02-15T10:01:00')
      },
      {
        id: '3',
        role: 'user',
        content: 'Can you make it more casual and conversational?',
        timestamp: new Date('2024-02-15T10:02:00')
      },
      {
        id: '4',
        role: 'assistant',
        content: `Absolutely! Here's a more casual, conversational version:

**Hook (0-5s):**
"Okay, real talk - when was the last time you actually worked out?"

**Problem (5-15s):**
"I get it. You're busy, you're tired, and honestly, who has time to go to the gym? But here's the thing - you're probably spending more time scrolling through social media than it would take to actually do something good for yourself."

**Solution (15-25s):**
"That's why I love [App Name]. It's like having a personal trainer in your pocket who actually gets that you're busy. 15 minutes here, 20 minutes there - it all adds up. And the best part? You can do it in your living room while your coffee brews."

**CTA (25-30s):**
"Look, your future self will thank you. Download [App Name] and let's stop making excuses together."

**Tone:** Friendly, relatable, like talking to a friend
**Pace:** Natural, conversational flow
**Key Words:** Real talk, honestly, look, together`,
        timestamp: new Date('2024-02-15T10:03:00')
      }
    ]
  }
]

export default function AIStudioPage() {
  const [currentSession, setCurrentSession] = useState<ChatSession>(mockChatSessions[0])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSessions, setShowSessions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [currentSession.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    // Add user message
    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))

    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're looking for help with: "${inputValue}"

Let me provide you with a comprehensive response that addresses your needs. This is a simulated AI response that would normally come from your AI service.

For UGC video creation, I'd recommend focusing on:
- Clear messaging
- Emotional connection
- Strong call-to-action
- Authentic storytelling

Would you like me to elaborate on any of these aspects or help you with something specific?`,
        timestamp: new Date()
      }

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }))
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setCurrentSession(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    }))
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')

    return { __html: formatted }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header - No Scroll */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">AI Studio</h1>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span>{currentSession.title}</span>
              {showSessions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="New Chat">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Save Chat">
              <Save className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Help">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions Dropdown */}
        {showSessions && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-2">
              {mockChatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setCurrentSession(session)
                    setShowSessions(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentSession.id === session.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.title}</span>
                    <span className="text-xs text-gray-500">
                      {session.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Body - Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {currentSession.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div 
                  className={`prose prose-sm max-w-none ${
                    message.role === 'user' ? 'text-white' : 'text-gray-900'
                  }`}
                  dangerouslySetInnerHTML={formatMessageContent(message.content)}
                />
                
                {/* Message Actions */}
                <div className={`flex items-center justify-between mt-3 pt-2 ${
                  message.role === 'user' ? 'border-blue-400' : 'border-gray-200'
                } border-t`}>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 rounded hover:bg-black/10 transition-colors duration-200"
                      title="Copy message"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    
                    {message.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => handleFeedback(message.id, 'positive')}
                          className={`p-1 rounded transition-colors duration-200 ${
                            message.feedback === 'positive' 
                              ? 'text-green-500' 
                              : 'hover:bg-black/10'
                          }`}
                          title="Thumbs up"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleFeedback(message.id, 'negative')}
                          className={`p-1 rounded transition-colors duration-200 ${
                            message.feedback === 'negative' 
                              ? 'text-red-500' 
                              : 'hover:bg-black/10'
                            }`}
                          title="Thumbs down"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-3xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Bar - No Scroll */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Left: Upload/Context */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Upload file">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Add image">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Add context">
                <FileText className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Input Field */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about UGC video creation, AI content generation, or creative strategy..."
                className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                }}
              />
            </div>

            {/* Right: Send & Voice */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Voice input">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex items-center justify-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Lightbulb className="w-3 h-3" />
              <span>UGC Script Ideas</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Zap className="w-3 h-3" />
              <span>Video Optimization</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <BookOpen className="w-3 h-3" />
              <span>Content Strategy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
