# ReelMate Backend API

A comprehensive backend API for ReelMate - an AI-powered UGC video generation platform.

## 🚀 Features

- **Authentication System**: Complete signup, signin, password reset, and change password functionality
- **User Management**: User profiles, settings, and preferences
- **Security**: JWT tokens, password hashing, rate limiting, and CORS protection
- **Email Service**: Password reset emails and welcome emails
- **Database**: Supabase integration with PostgreSQL
- **API Management**: API key generation and management
- **Integrations**: Third-party service integrations

## 🛠️ Tech Stack

- **Node.js** with Express.js
- **Supabase** (PostgreSQL database)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- SMTP email service (Gmail, SendGrid, etc.)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@reelmate.com
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Copy your project URL and anon key to `.env`

5. **Configure email service**
   - For Gmail: Enable 2FA and generate an app password
   - For SendGrid: Use your API key
   - Update SMTP settings in `.env`

## 🗄️ Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- The complete schema is in database/schema.sql
-- This will create all necessary tables and indexes
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify-reset-token/:token` - Verify reset token

### Request/Response Examples

#### Signup
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "company": "Tech Corp"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "subscription": "starter"
  },
  "token": "jwt-token"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt-token"
}
```

#### Change Password
```json
POST /api/auth/change-password
Headers: Authorization: Bearer <jwt-token>
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword123"
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers

## 📧 Email Features

- **Welcome Emails**: Sent to new users upon signup
- **Password Reset**: Secure password reset via email
- **HTML Templates**: Professional email templates
- **SMTP Support**: Gmail, SendGrid, and other SMTP providers

## 🗃️ Database Schema

The database includes tables for:
- Users and authentication
- Password reset tokens
- User sessions
- API keys
- User integrations
- Notification preferences
- User settings

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `SMTP_HOST` | SMTP server host | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |

## 🚨 Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication errors
- Database errors
- Rate limiting errors
- Global error handler

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error logging to console
- Rate limiting monitoring

## 🔄 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Rate limit info included in responses

## 🚀 Deployment

### Docker (Recommended)
```bash
docker build -t reelmate-backend .
docker run -p 5001:5001 reelmate-backend
```

### Manual Deployment
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production SMTP settings
4. Set up proper CORS origins
5. Use environment-specific database URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Webhook support
- [ ] Real-time notifications
- [ ] File upload handling
- [ ] Analytics and monitoring
