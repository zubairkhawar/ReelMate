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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/10 to-indigo-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed Header - No Scroll */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Studio</h1>
              <p className="text-sm text-gray-600">Your creative AI companion</p>
            </div>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <span className="font-medium">{currentSession.title}</span>
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
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Help">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions Dropdown */}
        {showSessions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 pt-3 border-t border-gray-200/50"
          >
            <div className="space-y-2">
              {mockChatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setCurrentSession(session)
                    setShowSessions(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentSession.id === session.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'hover:bg-white/60 text-gray-700 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.title}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {session.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Body - Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 relative z-0">
        {/* Welcome Message when no messages */}
        {currentSession.messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="max-w-md space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to AI Studio!</h2>
              <p className="text-gray-600 leading-relaxed">
                Your creative AI companion is ready to help you with UGC video creation, content strategy, and creative brainstorming.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Script Generation</h3>
                <p className="text-xs text-gray-600">Create compelling video scripts</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">UGC Strategy</h3>
                <p className="text-xs text-gray-600">Optimize for user engagement</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Content Ideas</h3>
                <p className="text-xs text-gray-600">Get creative inspiration</p>
              </div>
            </div>
          </motion.div>
        )}

        {currentSession.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl px-5 py-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-900'
              }`}>
                <div 
                  className={`prose prose-sm max-w-none ${
                    message.role === 'user' ? 'text-white' : 'text-gray-900'
                  }`}
                  dangerouslySetInnerHTML={formatMessageContent(message.content)}
                />
                
                {/* Message Actions */}
                <div className={`flex items-center justify-between mt-4 pt-3 ${
                  message.role === 'user' ? 'border-blue-400/30' : 'border-gray-200/50'
                } border-t`}>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-2 rounded-lg hover:bg-black/10 transition-all duration-200 hover:scale-105"
                      title="Copy message"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    
                    {message.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => handleFeedback(message.id, 'positive')}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                            message.feedback === 'positive' 
                              ? 'text-green-500 bg-green-50' 
                              : 'hover:bg-gray-100'
                          }`}
                          title="Thumbs up"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleFeedback(message.id, 'negative')}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                            message.feedback === 'negative' 
                              ? 'text-red-500 bg-red-50' 
                              : 'hover:bg-gray-100'
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
          </motion.div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 max-w-3xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-5 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Bar - No Scroll */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Left: Upload/Context */}
            <div className="flex items-center space-x-2">
              <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-200" title="Upload file">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-purple-200" title="Add image">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-indigo-200" title="Add context">
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
                className="w-full resize-none border border-gray-300 rounded-2xl px-5 py-4 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                }}
              />
            </div>

            {/* Right: Send & Voice */}
            <div className="flex items-center space-x-2">
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-indigo-200" title="Voice input">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:shadow-none"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-sm">
              <Lightbulb className="w-4 h-4" />
              <span>UGC Script Ideas</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-purple-200 hover:shadow-sm">
              <Zap className="w-4 h-4" />
              <span>Video Optimization</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-indigo-200 hover:shadow-sm">
              <BookOpen className="w-4 h-4" />
              <span>Content Strategy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
