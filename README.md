# 🎬 ReelMate - AI-Powered UGC Video Generation Platform

A comprehensive platform for creating, managing, and optimizing User-Generated Content (UGC) videos using AI technology. Built with Next.js frontend and Node.js backend, integrated with Supabase for database and storage.

## 🚀 Features

### **Frontend (Next.js 15 + TypeScript)**
- **Modern Dashboard** - Clean, responsive interface with Tailwind CSS
- **Authentication System** - Complete signup, login, and password management
- **Profile Management** - User profiles with avatar upload and preferences
- **Content Library** - Organize and manage video content
- **Campaign Management** - Create and track UGC campaigns
- **Analytics Dashboard** - Performance metrics and insights
- **Settings & Notifications** - Customizable user preferences
- **Responsive Design** - Mobile-first approach with Framer Motion animations

### **Backend (Node.js + Express)**
- **RESTful API** - Comprehensive endpoints for all functionality
- **Authentication** - JWT-based security with bcrypt password hashing
- **Email Service** - Welcome emails and password reset via Gmail SMTP
- **File Upload** - Avatar management with Supabase Storage
- **Database Integration** - PostgreSQL with Supabase
- **Security** - Rate limiting, CORS, and input validation
- **Testing** - Jest testing framework with Supertest

### **Database (Supabase)**
- **User Management** - Authentication and profile data
- **Content Storage** - Video metadata and file references
- **Campaign Data** - UGC campaign tracking and analytics
- **Real-time Features** - Live updates and notifications
- **Row Level Security** - Secure data access policies

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **HTTP Client**: Axios + Fetch API

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer with Gmail SMTP
- **File Upload**: Multer + Supabase Storage
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### **Infrastructure**
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (avatars)
- **Hosting**: Vercel (frontend) + Railway/Heroku (backend)
- **Version Control**: Git + GitHub

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Supabase** account and project
- **Gmail** account with app password (for email service)
- **Git** for version control

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/zubairkhawar/ReelMate.git
cd ReelMate
```

### 2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment template
cp env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables:**
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@reelmate.com

# Server Configuration
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### 3. **Database Setup**
```bash
# Run the schema in Supabase SQL Editor
cat database/schema.sql

# Set up avatar storage bucket
npm run setup-avatar
```

### 4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### 5. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### **Profile Management**
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Remove avatar
- `GET /api/profile/notifications` - Get notification preferences
- `PUT /api/profile/notifications` - Update notifications

### **Content & Campaigns**
- `GET /api/analytics/overview` - Dashboard analytics
- `GET /api/ugc/campaigns` - List campaigns
- `POST /api/ugc/campaigns` - Create campaign
- `GET /api/ugc/videos` - List videos
- `POST /api/ugc/generate` - Generate AI video

## 🗄️ Database Schema

### **Core Tables**
- **users** - User accounts and profiles
- **campaigns** - UGC campaign data
- **content** - Video and media metadata
- **analytics** - Performance tracking data
- **user_notifications** - Notification preferences
- **user_settings** - User configuration

### **Security Tables**
- **password_reset_tokens** - Password reset functionality
- **user_sessions** - Session management
- **api_keys** - API access control

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with 12 salt rounds
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Configurable origin restrictions
- **Input Validation** - Comprehensive request validation
- **Security Headers** - Helmet.js protection
- **Row Level Security** - Database-level access control

## 📧 Email Features

- **Welcome Emails** - Sent to new users upon signup
- **Password Reset** - Secure password reset via email
- **HTML Templates** - Professional email design
- **SMTP Support** - Gmail, SendGrid, and other providers

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
npm test
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
cd frontend
npm run build
vercel --prod
```

### **Backend (Railway/Heroku)**
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

## 🔧 Troubleshooting

### **Common Issues**

1. **Avatar Upload Fails**
   ```bash
   # Check Supabase storage bucket
   npm run setup-avatar
   ```

2. **Email Not Sending**
   - Verify Gmail app password in `.env`
   - Check SMTP settings

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity

4. **Authentication Errors**
   - Ensure JWT_SECRET is set
   - Check token expiration settings

### **Development Tips**

- Use `npm run dev` for hot reloading
- Check browser console for frontend errors
- Monitor backend logs for API issues
- Use Supabase dashboard for database debugging

## 📚 Documentation

- **API Reference**: See API endpoints above
- **Database Schema**: Check `backend/database/schema.sql`
- **Environment Variables**: See `backend/env.example`
- **Component Library**: Frontend components in `frontend/src/components`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/zubairkhawar/ReelMate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zubairkhawar/ReelMate/discussions)
- **Email**: hello@reelmate.com

## 🎯 Roadmap

- [ ] AI Video Generation Integration
- [ ] Shopify Integration
- [ ] Advanced Analytics Dashboard
- [ ] Mobile App (React Native)
- [ ] Multi-language Support
- [ ] Advanced Content Management
- [ ] Team Collaboration Features
- [ ] API Rate Limiting Dashboard

---

**Built with ❤️ by the ReelMate Team**

*Empowering creators with AI-driven UGC video generation*
